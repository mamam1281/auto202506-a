from fastapi import APIRouter, HTTPException, Depends, Body, Path, Query
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
# Import services
from app.services.token_service import TokenService # Assuming this exists and is injectable
from app.services.age_verification_service import AgeVerificationService
from app.services.adult_content_service import AdultContentService
from app.services.vip_content_service import VIPContentService
from app.services.flash_offer_service import FlashOfferService

# Import schemas
from app.schemas import (
    AdultContentDetail, AdultContentGalleryResponse, ContentPreviewResponse,
    ContentUnlockRequestNew, ContentUnlockResponse, UnlockHistoryResponse,
    AccessUpgradeRequest, AccessUpgradeResponse,
    ActiveFlashOffersResponse, FlashOfferPurchaseRequest, FlashOfferPurchaseResponse, FlashOfferActionResponse,
    VIPInfoResponse, VIPExclusiveContentItem # Assuming VIPExclusiveContentResponse is List[VIPExclusiveContentItem]
)
from app.models import User # For get_current_user if it returns User model

router = APIRouter(prefix="/v1/adult", tags=["Adult Content & Features"]) # Updated tag
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token") # Assuming tokenUrl might be more specific

# Placeholder for auth - replace with actual auth logic
async def get_current_user_id(token: str = Depends(oauth2_scheme)) -> int:
    # In a real app, decode token and get user_id from User model
    # For this subtask, we use a placeholder user_id.
    # This would typically involve a database lookup for the user based on token.
    # print(f"Auth token received (first 20 chars): {token[:20]}...")
    return 1 # Placeholder: Replace with actual user ID from token

# Dependency providers for services
def get_token_service(db: Session = Depends(get_db)):
    # Assuming TokenService might take db if it interacts with a TokenLedger table, or is stateless
    return TokenService(db=db) # Adjust if TokenService has different init

def get_age_verification_service(db: Session = Depends(get_db)):
    return AgeVerificationService(db=db)

def get_adult_content_service(
    db: Session = Depends(get_db),
    token_service: TokenService = Depends(get_token_service),
    age_service: AgeVerificationService = Depends(get_age_verification_service)
):
    return AdultContentService(db=db, token_service=token_service, age_verification_service=age_service)

def get_vip_content_service(
    db: Session = Depends(get_db),
    age_service: AgeVerificationService = Depends(get_age_verification_service),
    adult_content_service: AdultContentService = Depends(get_adult_content_service)
):
    return VIPContentService(db=db, age_verification_service=age_service, adult_content_service=adult_content_service)

def get_flash_offer_service(
    db: Session = Depends(get_db),
    token_service: TokenService = Depends(get_token_service),
    age_service: AgeVerificationService = Depends(get_age_verification_service),
    adult_content_service: AdultContentService = Depends(get_adult_content_service) # For price fetching
):
    return FlashOfferService(db=db, token_service=token_service, age_verification_service=age_service, adult_content_service=adult_content_service)

# Helper for error handling
def handle_service_errors(e: ValueError):
    error_message = str(e).lower()
    if "insufficient tokens" in error_message:
        raise HTTPException(status_code=402, detail=str(e))
    if "not found" in error_message or "invalid" in error_message and "stage" in error_message : # e.g. content not found, offer not found
        raise HTTPException(status_code=404, detail=str(e))
    if "age verification required" in error_message or "segment level too low" in error_message or "already" in error_message: # e.g. already unlocked/purchased
        raise HTTPException(status_code=403, detail=str(e)) # 403 for forbidden, 409 for conflict (already exists)
    if "expired" in error_message:
        raise HTTPException(status_code=410, detail=str(e)) # Gone for expired
    # Default for other ValueErrors considered client fault
    raise HTTPException(status_code=400, detail=str(e))


# --- Content Retrieval Endpoints ---
@router.get("/gallery", response_model=AdultContentGalleryResponse)
async def get_gallery(
    current_user_id: int = Depends(get_current_user_id),
    service: AdultContentService = Depends(get_adult_content_service)
):
    try:
        items = service.get_gallery_for_user(user_id=current_user_id)
        return AdultContentGalleryResponse(items=items)
    except ValueError as e:
        handle_service_errors(e)
    except Exception as e:
        # Log this exception
        raise HTTPException(status_code=500, detail="Internal server error getting gallery.")

@router.get("/{content_id}", response_model=AdultContentDetail)
async def get_content_details(
    content_id: int = Path(..., title="The ID of the content to retrieve"),
    current_user_id: int = Depends(get_current_user_id),
    service: AdultContentService = Depends(get_adult_content_service)
):
    try:
        details = service.get_content_details(user_id=current_user_id, content_id=content_id)
        if not details:
            raise HTTPException(status_code=404, detail="Content not found or access denied after age verification.")
        return details
    except ValueError as e:
        handle_service_errors(e)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error getting content details.")


@router.get("/{content_id}/preview", response_model=ContentPreviewResponse)
async def get_content_preview_endpoint( # Renamed to avoid conflict
    content_id: int = Path(..., title="The ID of the content to preview"),
    current_user_id: int = Depends(get_current_user_id),
    service: AdultContentService = Depends(get_adult_content_service)
):
    try:
        preview_data = service.get_content_preview(user_id=current_user_id, content_id=content_id)
        if not preview_data:
            # This might mean content not found or no access even to basic preview due to age verification
            raise HTTPException(status_code=404, detail="Preview not available or content not found.")
        return preview_data
    except ValueError as e:
        handle_service_errors(e)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error getting content preview.")

# --- Unlock Processing Endpoints ---
@router.post("/unlock", response_model=ContentUnlockResponse)
async def unlock_content_stage_endpoint( # Renamed to avoid conflict
    request_data: ContentUnlockRequestNew = Body(...),
    current_user_id: int = Depends(get_current_user_id),
    service: AdultContentService = Depends(get_adult_content_service)
):
    try:
        # User ID for service methods should come from authenticated user
        response = service.unlock_content_stage(user_id=current_user_id, request=request_data)
        return response
    except ValueError as e:
        handle_service_errors(e)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error unlocking content.")

@router.get("/my-unlocks", response_model=UnlockHistoryResponse)
async def get_my_unlocks(
    current_user_id: int = Depends(get_current_user_id),
    service: AdultContentService = Depends(get_adult_content_service)
):
    try:
        history = service.get_user_unlock_history(user_id=current_user_id)
        return UnlockHistoryResponse(history=history)
    except ValueError as e: # Should not happen if service returns [] on age fail
        handle_service_errors(e)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error getting unlock history.")

@router.post("/upgrade-access", response_model=AccessUpgradeResponse)
async def upgrade_access(
    request_data: AccessUpgradeRequest = Body(...),
    current_user_id: int = Depends(get_current_user_id),
    service: AdultContentService = Depends(get_adult_content_service)
):
    try:
        response = service.upgrade_access_temporarily(user_id=current_user_id, request=request_data)
        return response
    except ValueError as e:
        handle_service_errors(e)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error upgrading access.")


# --- Flash Offer Endpoints ---
@router.get("/flash-offers", response_model=ActiveFlashOffersResponse)
async def get_active_flash_offers_endpoint( # Renamed
    current_user_id: int = Depends(get_current_user_id),
    service: FlashOfferService = Depends(get_flash_offer_service)
):
    try:
        # Service method already checks age verification and returns empty list if needed
        response = service.get_active_flash_offers(user_id=current_user_id)
        return response
    except ValueError as e: # Should not happen from get_active_flash_offers as designed
        handle_service_errors(e)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error getting flash offers.")

@router.post("/flash-offers/{offer_id}/purchase", response_model=FlashOfferPurchaseResponse)
async def purchase_flash_offer(
    offer_id: int = Path(..., title="The ID of the flash offer to purchase"),
    # FlashOfferPurchaseRequest is currently empty, so no Body() needed unless it changes
    # request_data: FlashOfferPurchaseRequest = Body(None), # If it can be empty or have optional fields
    current_user_id: int = Depends(get_current_user_id),
    service: FlashOfferService = Depends(get_flash_offer_service)
):
    try:
        # Pass an empty FlashOfferPurchaseRequest if the service expects it, even if not used by current logic
        response = service.process_flash_purchase(user_id=current_user_id, offer_id=offer_id, purchase_request=FlashOfferPurchaseRequest())
        return response
    except ValueError as e:
        handle_service_errors(e)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error purchasing flash offer.")

@router.delete("/flash-offers/{offer_id}", response_model=FlashOfferActionResponse)
async def delete_flash_offer( # Renamed from reject_or_expire_flash_offer for typical REST
    offer_id: int = Path(..., title="The ID of the flash offer to delete/reject"),
    current_user_id: int = Depends(get_current_user_id),
    service: FlashOfferService = Depends(get_flash_offer_service)
):
    try:
        response = service.reject_or_expire_flash_offer(user_id=current_user_id, offer_id=offer_id)
        return response
    except ValueError as e:
        handle_service_errors(e)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error deleting flash offer.")

# --- VIP Info Endpoints ---
@router.get("/vip/info", response_model=VIPInfoResponse)
async def get_vip_user_info( # Renamed
    current_user_id: int = Depends(get_current_user_id),
    service: VIPContentService = Depends(get_vip_content_service)
):
    try:
        info = service.get_vip_info(user_id=current_user_id)
        if not info: # Should not happen if service returns default Non-VIP response
             raise HTTPException(status_code=404, detail="VIP info not available (potentially not age-verified).")
        return info
    except ValueError as e: # Should not happen from get_vip_info as designed
        handle_service_errors(e)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error getting VIP info.")

@router.get("/vip/exclusive-content", response_model=List[VIPExclusiveContentItem])
async def get_vip_exclusive_gallery( # Renamed
    current_user_id: int = Depends(get_current_user_id),
    service: VIPContentService = Depends(get_vip_content_service)
):
    try:
        # Service method already checks age verification and returns empty list if needed
        items = service.get_vip_exclusive_content(user_id=current_user_id)
        return items
    except ValueError as e: # Should not happen from get_vip_exclusive_content as designed
        handle_service_errors(e)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error getting VIP exclusive content.")

