// export function calculateReward(streak_count) {
//   // Stub
//   return streak_count * 10;
// }
// export function spinGacha() {
//   // Stub
//   return { item_rarity: "common" };
// }
// To avoid "Attempted import error: 'calculateReward' is not exported from './utils/rewardUtils.js'" if imported by a page:
const calculateReward = (streak_count) => streak_count * 10;
const spinGacha = () => ({ item_rarity: "common" });
export { calculateReward, spinGacha };
