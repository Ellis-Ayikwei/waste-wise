import 'package:bytedev/app/redux/actions/customer_actions.dart';
import 'package:bytedev/app/redux/states/customer_state.dart';

CustomerState customerReducer(CustomerState state, dynamic action) {
  if (action is CustomerLoadingAction) {
    return state.copyWith(isLoading: action.isLoading);
  } else if (action is CustomerErrorAction) {
    return state.copyWith(error: action.error, isLoading: false);
  } else if (action is UpdateActivePickupsAction) {
    return state.copyWith(activePickups: action.pickups, isLoading: false);
  } else if (action is UpdatePickupHistoryAction) {
    return state.copyWith(pickupHistory: action.history, isLoading: false);
  } else if (action is UpdateWalletAction) {
    return state.copyWith(wallet: action.wallet, isLoading: false);
  } else if (action is UpdateRewardPointsAction) {
    return state.copyWith(rewardPoints: action.points, isLoading: false);
  } else if (action is UpdateSavedProvidersAction) {
    return state.copyWith(savedProviders: action.providers, isLoading: false);
  } else if (action is UpdateImpactStatsAction) {
    return state.copyWith(impactStats: action.stats, isLoading: false);
  } else if (action is CustomerSuccessAction) {
    // Handle specific success actions based on actionType
    switch (action.actionType) {
      case 'pickup_requested':
        return state.copyWith(
          currentPickup: action.data as Map<String, dynamic>,
          isLoading: false,
        );
      case 'pickup_scheduled':
        return state.copyWith(
          currentPickup: action.data as Map<String, dynamic>,
          isLoading: false,
        );
      case 'pickup_cancelled':
        // Remove cancelled pickup from active pickups
        final updatedPickups = List.from(state.activePickups)
          ..removeWhere((pickup) => pickup['id'] == action.data);
        return state.copyWith(
          activePickups: updatedPickups,
          isLoading: false,
        );
      default:
        return state.copyWith(isLoading: false);
    }
  }
  return state;
}