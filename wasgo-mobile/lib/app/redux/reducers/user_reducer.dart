import 'package:bytedev/app/redux/actions/user_actions.dart';
import 'package:bytedev/app/redux/states/user_state.dart';

UserState userReducer(UserState state, dynamic action) {
  if (action is UserLoadingAction) {
    return state.copyWith(isLoading: action.isLoading);
  }
  
  if (action is UserErrorAction) {
    return state.copyWith(error: action.error);
  }
  
  // Pickup Management
  if (action is RequestPickupAction) {
    return state.copyWith(isLoading: false);
  }
  
  if (action is SchedulePickupAction) {
    return state.copyWith(isLoading: false);
  }
  
  if (action is FetchActivePickupsAction) {
    return state.copyWith(isLoading: true);
  }
  
  if (action is FetchPickupHistoryAction) {
    return state.copyWith(isLoading: true);
  }
  
  if (action is CancelPickupAction) {
    return state.copyWith(isLoading: false);
  }
  
  if (action is TrackPickupAction) {
    return state.copyWith(isLoading: false);
  }
  
  // Wallet Management
  if (action is FetchWalletAction) {
    return state.copyWith(isLoading: true);
  }
  
  if (action is AddFundsAction) {
    return state.copyWith(isLoading: false);
  }
  
  // Smart Bins
  if (action is FetchSmartBinsAction) {
    return state.copyWith(isLoading: true);
  }
  
  if (action is UpdateSmartBinAction) {
    return state.copyWith(isLoading: false);
  }
  
  // Recycling Centers
  if (action is FetchRecyclingCentersAction) {
    return state.copyWith(isLoading: true);
  }
  
  // Messages & Notifications
  if (action is FetchMessagesAction) {
    return state.copyWith(isLoading: true);
  }
  
  if (action is MarkMessageAsReadAction) {
    return state.copyWith(isLoading: false);
  }
  
  if (action is FetchNotificationsAction) {
    return state.copyWith(isLoading: true);
  }
  
  // Rewards & Badges
  if (action is FetchRewardsAction) {
    return state.copyWith(isLoading: true);
  }
  
  if (action is RedeemRewardsAction) {
    return state.copyWith(isLoading: false);
  }
  
  if (action is FetchBadgesAction) {
    return state.copyWith(isLoading: true);
  }
  
  // Impact Stats
  if (action is FetchImpactStatsAction) {
    return state.copyWith(isLoading: true);
  }
  
  // Profile
  if (action is UpdateProfileAction) {
    return state.copyWith(isLoading: false);
  }
  
  if (action is UploadProfilePhotoAction) {
    return state.copyWith(isLoading: false);
  }
  
  return state;
}
