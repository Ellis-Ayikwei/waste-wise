import 'package:bytedev/app/redux/actions/customer_actions.dart';
import 'package:bytedev/app/redux/states/app_state.dart';
import 'package:redux/redux.dart';

class CustomerController {
  final Store<AppState> _store;

  CustomerController(this._store);

  // Pickup Management
  void requestPickup(Map<String, dynamic> pickupData) {
    _store.dispatch(CustomerLoadingAction(true));
    _store.dispatch(RequestPickupAction(pickupData));
  }

  void schedulePickup(Map<String, dynamic> scheduleData) {
    _store.dispatch(CustomerLoadingAction(true));
    _store.dispatch(SchedulePickupAction(scheduleData));
  }

  void fetchActivePickups() {
    _store.dispatch(CustomerLoadingAction(true));
    _store.dispatch(FetchActivePickupsAction());
  }

  void fetchPickupHistory() {
    _store.dispatch(CustomerLoadingAction(true));
    _store.dispatch(FetchPickupHistoryAction());
  }

  void cancelPickup(String pickupId) {
    _store.dispatch(CustomerLoadingAction(true));
    _store.dispatch(CancelPickupAction(pickupId));
  }

  void trackPickup(String pickupId) {
    _store.dispatch(TrackPickupAction(pickupId));
  }

  // Wallet Management
  void fetchWallet() {
    _store.dispatch(CustomerLoadingAction(true));
    _store.dispatch(FetchWalletAction());
  }

  void addFunds(double amount) {
    _store.dispatch(CustomerLoadingAction(true));
    _store.dispatch(AddFundsAction(amount));
  }

  // Rewards Management
  void fetchRewards() {
    _store.dispatch(CustomerLoadingAction(true));
    _store.dispatch(FetchRewardsAction());
  }

  void redeemRewards(int points) {
    _store.dispatch(CustomerLoadingAction(true));
    _store.dispatch(RedeemRewardsAction(points));
  }

  // Provider Management
  void saveProvider(String providerId) {
    _store.dispatch(SaveProviderAction(providerId));
  }

  void removeSavedProvider(String providerId) {
    _store.dispatch(RemoveSavedProviderAction(providerId));
  }

  // Impact Stats
  void fetchImpactStats() {
    _store.dispatch(CustomerLoadingAction(true));
    _store.dispatch(FetchImpactStatsAction());
  }
}