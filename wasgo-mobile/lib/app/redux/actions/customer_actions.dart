abstract class CustomerAction {}

// Pickup Actions
class RequestPickupAction extends CustomerAction {
  final Map<String, dynamic> pickupData;
  RequestPickupAction(this.pickupData);
}

class SchedulePickupAction extends CustomerAction {
  final Map<String, dynamic> scheduleData;
  SchedulePickupAction(this.scheduleData);
}

class FetchActivePickupsAction extends CustomerAction {}

class FetchPickupHistoryAction extends CustomerAction {}

class CancelPickupAction extends CustomerAction {
  final String pickupId;
  CancelPickupAction(this.pickupId);
}

class TrackPickupAction extends CustomerAction {
  final String pickupId;
  TrackPickupAction(this.pickupId);
}

// Wallet Actions
class FetchWalletAction extends CustomerAction {}

class AddFundsAction extends CustomerAction {
  final double amount;
  AddFundsAction(this.amount);
}

// Rewards Actions
class FetchRewardsAction extends CustomerAction {}

class RedeemRewardsAction extends CustomerAction {
  final int points;
  RedeemRewardsAction(this.points);
}

// Provider Actions
class SaveProviderAction extends CustomerAction {
  final String providerId;
  SaveProviderAction(this.providerId);
}

class RemoveSavedProviderAction extends CustomerAction {
  final String providerId;
  RemoveSavedProviderAction(this.providerId);
}

// Impact Actions
class FetchImpactStatsAction extends CustomerAction {}

// Success Actions
class CustomerLoadingAction extends CustomerAction {
  final bool isLoading;
  CustomerLoadingAction(this.isLoading);
}

class CustomerSuccessAction extends CustomerAction {
  final String actionType;
  final dynamic data;
  CustomerSuccessAction(this.actionType, this.data);
}

class CustomerErrorAction extends CustomerAction {
  final String error;
  CustomerErrorAction(this.error);
}

class UpdateActivePickupsAction extends CustomerAction {
  final List<dynamic> pickups;
  UpdateActivePickupsAction(this.pickups);
}

class UpdatePickupHistoryAction extends CustomerAction {
  final List<dynamic> history;
  UpdatePickupHistoryAction(this.history);
}

class UpdateWalletAction extends CustomerAction {
  final Map<String, dynamic> wallet;
  UpdateWalletAction(this.wallet);
}

class UpdateRewardPointsAction extends CustomerAction {
  final int points;
  UpdateRewardPointsAction(this.points);
}

class UpdateSavedProvidersAction extends CustomerAction {
  final List<dynamic> providers;
  UpdateSavedProvidersAction(this.providers);
}

class UpdateImpactStatsAction extends CustomerAction {
  final Map<String, dynamic> stats;
  UpdateImpactStatsAction(this.stats);
}