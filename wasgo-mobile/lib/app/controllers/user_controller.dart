import 'package:bytedev/app/redux/actions/user_actions.dart';
import 'package:bytedev/app/redux/states/app_state.dart';
import 'package:redux/redux.dart';

class UserController {
  final Store<AppState> _store;

  UserController(this._store);

  // Pickup Management
  void requestPickup(Map<String, dynamic> pickupData) {
    _store.dispatch(UserLoadingAction(true));
    _store.dispatch(RequestPickupAction(pickupData));
  }

  void schedulePickup(Map<String, dynamic> scheduleData) {
    _store.dispatch(UserLoadingAction(true));
    _store.dispatch(SchedulePickupAction(scheduleData));
  }

  void fetchActivePickups() {
    _store.dispatch(UserLoadingAction(true));
    _store.dispatch(FetchActivePickupsAction());
  }

  void fetchPickupHistory() {
    _store.dispatch(UserLoadingAction(true));
    _store.dispatch(FetchPickupHistoryAction());
  }

  void cancelPickup(String pickupId) {
    _store.dispatch(UserLoadingAction(true));
    _store.dispatch(CancelPickupAction(pickupId));
  }

  void trackPickup(String pickupId) {
    _store.dispatch(TrackPickupAction(pickupId));
  }

  // Wallet Management
  void fetchWallet() {
    _store.dispatch(UserLoadingAction(true));
    _store.dispatch(FetchWalletAction());
  }

  void addFunds(double amount) {
    _store.dispatch(UserLoadingAction(true));
    _store.dispatch(AddFundsAction(amount));
  }

  // Smart Bins
  void fetchSmartBins() {
    _store.dispatch(UserLoadingAction(true));
    _store.dispatch(FetchSmartBinsAction());
  }

  void updateSmartBin(String binId, Map<String, dynamic> data) {
    _store.dispatch(UserLoadingAction(true));
    _store.dispatch(UpdateSmartBinAction(binId, data));
  }

  // Recycling Centers
  void fetchRecyclingCenters() {
    _store.dispatch(UserLoadingAction(true));
    _store.dispatch(FetchRecyclingCentersAction());
  }

  // Messages & Notifications
  void fetchMessages() {
    _store.dispatch(UserLoadingAction(true));
    _store.dispatch(FetchMessagesAction());
  }

  void markMessageAsRead(String messageId) {
    _store.dispatch(MarkMessageAsReadAction(messageId));
  }

  void fetchNotifications() {
    _store.dispatch(UserLoadingAction(true));
    _store.dispatch(FetchNotificationsAction());
  }

  // Rewards & Badges
  void fetchRewards() {
    _store.dispatch(UserLoadingAction(true));
    _store.dispatch(FetchRewardsAction());
  }

  void redeemRewards(int points) {
    _store.dispatch(UserLoadingAction(true));
    _store.dispatch(RedeemRewardsAction(points));
  }

  void fetchBadges() {
    _store.dispatch(UserLoadingAction(true));
    _store.dispatch(FetchBadgesAction());
  }

  // Impact Stats
  void fetchImpactStats() {
    _store.dispatch(UserLoadingAction(true));
    _store.dispatch(FetchImpactStatsAction());
  }

  // Profile Management
  void updateProfile(Map<String, dynamic> profileData) {
    _store.dispatch(UserLoadingAction(true));
    _store.dispatch(UpdateProfileAction(profileData));
  }

  void uploadProfilePhoto(String photoPath) {
    _store.dispatch(UserLoadingAction(true));
    _store.dispatch(UploadProfilePhotoAction(photoPath));
  }
}
