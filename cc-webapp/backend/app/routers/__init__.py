# Import individual router modules to make them accessible
# e.g., from . import users, items

# For the current task, we need to make sure the tracking router can be found
from . import tracking
from . import notification # Assuming this exists and might be imported similarly
from . import adult_content # Assuming this exists
# Add other routers as needed, for example:
# from . import auth
# from . import users
# from . import gacha
# from . import games

# You can also define an __all__ list if you want to control `from app.routers import *`
# __all__ = ["tracking", "notification", "adult_content", "auth", "users"]
