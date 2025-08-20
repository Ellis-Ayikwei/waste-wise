import 'package:flutter/material.dart';
import 'package:bytedev/core/theme/app_colors.dart';
import 'package:bytedev/app/views/main_screen.dart';

class RewardsView extends StatefulWidget {
  const RewardsView({super.key});

  @override
  State<RewardsView> createState() => _RewardsViewState();
}

class _RewardsViewState extends State<RewardsView> {
  int _selectedTab = 0;

  // Mock data
  final int _totalPoints = 2840;
  final int _level = 5;
  final String _rank = 'Eco Warrior';
  final int _pointsToNextLevel = 160;

  final List<Map<String, dynamic>> _badges = [
    {
      'id': '1',
      'name': 'First Pickup',
      'description': 'Completed your first waste pickup',
      'icon': Icons.star,
      'color': Colors.amber,
      'unlocked': true,
      'date': '2024-01-10',
    },
    {
      'id': '2',
      'name': 'Recycling Master',
      'description': 'Recycled 100 items',
      'icon': Icons.recycling,
      'color': AppColors.primary,
      'unlocked': true,
      'date': '2024-01-15',
    },
    {
      'id': '3',
      'name': 'Eco Warrior',
      'description': 'Saved 50kg of CO2',
      'icon': Icons.eco,
      'color': AppColors.success,
      'unlocked': true,
      'date': '2024-01-20',
    },
    {
      'id': '4',
      'name': 'Consistency King',
      'description': '30 days of regular pickups',
      'icon': Icons.calendar_today,
      'color': AppColors.info,
      'unlocked': false,
      'progress': 25,
    },
    {
      'id': '5',
      'name': 'Referral Champion',
      'description': 'Referred 10 friends',
      'icon': Icons.people,
      'color': AppColors.warning,
      'unlocked': false,
      'progress': 7,
    },
    {
      'id': '6',
      'name': 'Zero Waste Hero',
      'description': 'Achieved 100% recycling rate',
      'icon': Icons.verified,
      'color': AppColors.error,
      'unlocked': false,
      'progress': 0,
    },
  ];

  final List<Map<String, dynamic>> _rewards = [
    {
      'id': '1',
      'name': '₵50 Credit',
      'description': 'Redeem for pickup services',
      'points': 500,
      'icon': Icons.account_balance_wallet,
      'color': AppColors.primary,
      'available': true,
    },
    {
      'id': '2',
      'name': 'Free Express Pickup',
      'description': 'Skip the queue',
      'points': 300,
      'icon': Icons.flash_on,
      'color': AppColors.warning,
      'available': true,
    },
    {
      'id': '3',
      'name': 'Premium Support',
      'description': 'Priority customer service',
      'points': 200,
      'icon': Icons.headset_mic,
      'color': AppColors.info,
      'available': true,
    },
    {
      'id': '4',
      'name': 'Eco-friendly Tote Bag',
      'description': 'Sustainable shopping bag',
      'points': 1000,
      'icon': Icons.shopping_bag,
      'color': AppColors.success,
      'available': false,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return CustomerMainScreen(
      title: 'Rewards',
      child: Column(
        children: [
          _buildHeader(),
          _buildTabBar(),
          Expanded(
            child: _selectedTab == 0 ? _buildBadgesTab() : _buildRewardsTab(),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [AppColors.primary, AppColors.primaryDark],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withOpacity(0.3),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Your Points',
                    style: TextStyle(
                      color: Colors.white70,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '$_totalPoints',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 36,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: const Icon(
                  Icons.emoji_events,
                  color: Colors.white,
                  size: 32,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          Row(
            children: [
              Expanded(
                child: _buildStatCard('Level', '$_level', Icons.trending_up),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: _buildStatCard('Rank', _rank, Icons.military_tech),
              ),
            ],
          ),
          const SizedBox(height: 16),
          _buildProgressBar(),
        ],
      ),
    );
  }

  Widget _buildStatCard(String label, String value, IconData icon) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          Icon(icon, color: Colors.white, size: 24),
          const SizedBox(height: 8),
          Text(
            value,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          Text(
            label,
            style: TextStyle(
              color: Colors.white.withOpacity(0.8),
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProgressBar() {
    final progress = (_totalPoints % 500) / 500;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'Progress to Next Level',
              style: TextStyle(
                color: Colors.white70,
                fontSize: 14,
              ),
            ),
            Text(
              '$_pointsToNextLevel points needed',
              style: const TextStyle(
                color: Colors.white70,
                fontSize: 14,
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        LinearProgressIndicator(
          value: progress,
          backgroundColor: Colors.white.withOpacity(0.3),
          valueColor: const AlwaysStoppedAnimation<Color>(Colors.white),
          minHeight: 8,
        ),
      ],
    );
  }

  Widget _buildTabBar() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Expanded(
            child: _buildTabButton('Badges', 0),
          ),
          Expanded(
            child: _buildTabButton('Rewards', 1),
          ),
        ],
      ),
    );
  }

  Widget _buildTabButton(String label, int index) {
    final isSelected = _selectedTab == index;
    return GestureDetector(
      onTap: () => setState(() => _selectedTab = index),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primary : Colors.transparent,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Text(
          label,
          textAlign: TextAlign.center,
          style: TextStyle(
            color: isSelected ? Colors.white : AppColors.textPrimary,
            fontSize: 14,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }

  Widget _buildBadgesTab() {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Achievements',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
              ),
              Text(
                '${_badges.where((b) => b['unlocked']).length}/${_badges.length}',
                style: const TextStyle(
                  fontSize: 16,
                  color: AppColors.textSecondary,
                ),
              ),
            ],
          ),
        ),
        Expanded(
          child: GridView.builder(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
              childAspectRatio: 0.8,
            ),
            itemCount: _badges.length,
            itemBuilder: (context, index) {
              final badge = _badges[index];
              return _buildBadgeCard(badge);
            },
          ),
        ),
      ],
    );
  }

  Widget _buildBadgeCard(Map<String, dynamic> badge) {
    final isUnlocked = badge['unlocked'] as bool;
    final color = badge['color'] as Color;
    
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isUnlocked ? color : AppColors.border,
          width: isUnlocked ? 2 : 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: isUnlocked ? color.withOpacity(0.1) : Colors.grey.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(
              badge['icon'],
              color: isUnlocked ? color : Colors.grey,
              size: 32,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            badge['name'],
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: isUnlocked ? AppColors.textPrimary : Colors.grey,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 4),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8),
            child: Text(
              badge['description'],
              style: TextStyle(
                fontSize: 12,
                color: isUnlocked ? AppColors.textSecondary : Colors.grey,
              ),
              textAlign: TextAlign.center,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ),
          if (!isUnlocked && badge['progress'] != null) ...[
            const SizedBox(height: 8),
            LinearProgressIndicator(
              value: (badge['progress'] as int) / 100,
              backgroundColor: Colors.grey.withOpacity(0.3),
              valueColor: AlwaysStoppedAnimation<Color>(color),
              minHeight: 4,
            ),
            const SizedBox(height: 4),
            Text(
              '${badge['progress']}%',
              style: TextStyle(
                fontSize: 12,
                color: color,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
          if (isUnlocked && badge['date'] != null) ...[
            const SizedBox(height: 8),
            Text(
              'Unlocked ${badge['date']}',
              style: const TextStyle(
                fontSize: 10,
                color: AppColors.textSecondary,
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildRewardsTab() {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Available Rewards',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
              ),
              Text(
                '$_totalPoints points',
                style: const TextStyle(
                  fontSize: 16,
                  color: AppColors.primary,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ),
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: _rewards.length,
            itemBuilder: (context, index) {
              final reward = _rewards[index];
              return _buildRewardCard(reward);
            },
          ),
        ),
      ],
    );
  }

  Widget _buildRewardCard(Map<String, dynamic> reward) {
    final isAvailable = reward['available'] as bool;
    final canAfford = _totalPoints >= reward['points'];
    final color = reward['color'] as Color;
    
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(
              reward['icon'],
              color: color,
              size: 24,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  reward['name'],
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  reward['description'],
                  style: const TextStyle(
                    fontSize: 14,
                    color: AppColors.textSecondary,
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Icon(
                      Icons.star,
                      color: AppColors.warning,
                      size: 16,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      '${reward['points']} points',
                      style: const TextStyle(
                        fontSize: 14,
                        color: AppColors.textSecondary,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          ElevatedButton(
            onPressed: isAvailable && canAfford ? () => _redeemReward(reward) : null,
            style: ElevatedButton.styleFrom(
              backgroundColor: isAvailable && canAfford ? color : Colors.grey,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            child: Text(
              isAvailable && canAfford ? 'Redeem' : 'Unavailable',
              style: const TextStyle(fontSize: 12),
            ),
          ),
        ],
      ),
    );
  }

  void _redeemReward(Map<String, dynamic> reward) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Redeem Reward'),
        content: Text('Are you sure you want to redeem "${reward['name']}" for ${reward['points']} points?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              // TODO: Implement reward redemption
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('${reward['name']} redeemed successfully!'),
                  backgroundColor: AppColors.success,
                ),
              );
            },
            child: const Text('Redeem'),
          ),
        ],
      ),
    );
  }
}
