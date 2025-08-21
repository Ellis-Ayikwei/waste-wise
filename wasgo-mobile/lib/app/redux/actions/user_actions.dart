// Loading Actions
class UserLoadingAction {
  final bool isLoading;
  UserLoadingAction(this.isLoading);
}

// Error Actions
class UserErrorAction {
  final String? error;
  UserErrorAction(this.error);
}

// Pickup Management Actions
class RequestPickupAction {
  final Map<String, dynamic> pickupData;
  RequestPickupAction(this.pickupData);
}

class SchedulePickupAction {
  final Map<String, dynamic> scheduleData;
  SchedulePickupAction(this.scheduleData);
}

class FetchActivePickupsAction {}

class FetchPickupHistoryAction {}

class CancelPickupAction {
  final String pickupId;
  CancelPickupAction(this.pickupId);
}

class TrackPickupAction {
  final String pickupId;
  TrackPickupAction(this.pickupId);
}

// Wallet Management Actions
class FetchWalletAction {}

class AddFundsAction {
  final double amount;
  AddFundsAction(this.amount);
}

// Smart Bins Actions
class FetchSmartBinsAction {}

class UpdateSmartBinAction {
  final String binId;
  final Map<String, dynamic> data;
  UpdateSmartBinAction(this.binId, this.data);
}

// Recycling Centers Actions
class FetchRecyclingCentersAction {}

// Messages & Notifications Actions
class FetchMessagesAction {}

class MarkMessageAsReadAction {
  final String messageId;
  MarkMessageAsReadAction(this.messageId);
}

class FetchNotificationsAction {}

// Rewards & Badges Actions
class FetchRewardsAction {}

class RedeemRewardsAction {
  final int points;
  RedeemRewardsAction(this.points);
}

class FetchBadgesAction {}

// Impact Stats Actions
class FetchImpactStatsAction {}

// Profile Actions
class UpdateProfileAction {
  final Map<String, dynamic> profileData;
  UpdateProfileAction(this.profileData);
}

class UploadProfilePhotoAction {
  final String photoPath;
  UploadProfilePhotoAction(this.photoPath);
}
