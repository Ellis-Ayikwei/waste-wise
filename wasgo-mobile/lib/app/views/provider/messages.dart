import 'package:flutter/material.dart';
import 'package:bytedev/core/theme/app_colors.dart';
import 'package:bytedev/app/views/main_screen.dart';

class ProviderMessagesView extends StatefulWidget {
  const ProviderMessagesView({Key? key}) : super(key: key);

  @override
  State<ProviderMessagesView> createState() => _ProviderMessagesViewState();
}

class _ProviderMessagesViewState extends State<ProviderMessagesView> {
  String _selectedFilter = 'All';
  final TextEditingController _searchController = TextEditingController();

  // Mock data for messages
  final List<Map<String, dynamic>> _messages = [
    {
      'id': '1',
      'sender': 'Wasgo Support',
      'lastMessage': 'Your job request has been approved. Please proceed to the location.',
      'timestamp': '2 hours ago',
      'unread': true,
      'type': 'support',
      'avatar': 'S',
    },
    {
      'id': '2',
      'sender': 'Customer - John Smith',
      'lastMessage': 'Thank you for the quick pickup service!',
      'timestamp': '1 day ago',
      'unread': false,
      'type': 'customer',
      'avatar': 'J',
    },
    {
      'id': '3',
      'sender': 'System Notification',
      'lastMessage': 'New job request available in your area.',
      'timestamp': '2 days ago',
      'unread': false,
      'type': 'system',
      'avatar': 'N',
    },
    {
      'id': '4',
      'sender': 'Wasgo Support',
      'lastMessage': 'Your account verification is complete.',
      'timestamp': '3 days ago',
      'unread': false,
      'type': 'support',
      'avatar': 'S',
    },
    {
      'id': '5',
      'sender': 'Customer - Sarah Johnson',
      'lastMessage': 'Can you reschedule the pickup for tomorrow?',
      'timestamp': '4 days ago',
      'unread': false,
      'type': 'customer',
      'avatar': 'S',
    },
  ];

  List<Map<String, dynamic>> get _filteredMessages {
    if (_selectedFilter == 'All') return _messages;
    return _messages.where((msg) => msg['type'] == _selectedFilter.toLowerCase()).toList();
  }

  @override
  Widget build(BuildContext context) {
    return ProviderMainScreen(
      title: 'Messages',
      child: Column(
        children: [
          _buildHeader(),
          _buildSearchAndFilter(),
          Expanded(
            child: _filteredMessages.isEmpty
                ? _buildEmptyState()
                : _buildMessagesList(),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    final unreadCount = _messages.where((msg) => msg['unread']).length;
    
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [AppColors.primary, AppColors.primaryDark],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: const BorderRadius.only(
          bottomLeft: Radius.circular(20),
          bottomRight: Radius.circular(20),
        ),
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
                    'Messages',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    '$unreadCount unread messages',
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.8),
                      fontSize: 16,
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(
                  Icons.message,
                  color: Colors.white,
                  size: 24,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              _buildStatCard('All', _messages.length.toString(), Icons.all_inbox),
              const SizedBox(width: 12),
              _buildStatCard('Support', _messages.where((msg) => msg['type'] == 'support').length.toString(), Icons.headset_mic),
              const SizedBox(width: 12),
              _buildStatCard('Customers', _messages.where((msg) => msg['type'] == 'customer').length.toString(), Icons.people),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(String label, String value, IconData icon) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.1),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          children: [
            Icon(icon, color: Colors.white, size: 20),
            const SizedBox(height: 4),
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
      ),
    );
  }

  Widget _buildSearchAndFilter() {
    return Container(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          // Search bar
          Container(
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.border),
            ),
            child: TextField(
              controller: _searchController,
              decoration: const InputDecoration(
                hintText: 'Search messages...',
                prefixIcon: Icon(Icons.search),
                border: InputBorder.none,
                contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              ),
              onChanged: (value) {
                setState(() {
                  // TODO: Implement search functionality
                });
              },
            ),
          ),
          const SizedBox(height: 12),
          // Filter chips
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                _buildFilterChip('All'),
                const SizedBox(width: 8),
                _buildFilterChip('Support'),
                const SizedBox(width: 8),
                _buildFilterChip('Customer'),
                const SizedBox(width: 8),
                _buildFilterChip('System'),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String label) {
    final isSelected = _selectedFilter == label;
    return FilterChip(
      label: Text(label),
      selected: isSelected,
      onSelected: (selected) {
        setState(() {
          _selectedFilter = label;
        });
      },
      selectedColor: AppColors.primary,
      labelStyle: TextStyle(
        color: isSelected ? Colors.white : AppColors.textPrimary,
        fontWeight: FontWeight.w500,
      ),
      backgroundColor: AppColors.surface,
      side: BorderSide(color: AppColors.border),
    );
  }

  Widget _buildMessagesList() {
    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      itemCount: _filteredMessages.length,
      itemBuilder: (context, index) {
        final message = _filteredMessages[index];
        return _buildMessageItem(message);
      },
    );
  }

  Widget _buildMessageItem(Map<String, dynamic> message) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: ListTile(
        leading: Stack(
          children: [
            CircleAvatar(
              radius: 24,
              backgroundColor: _getAvatarColor(message['type']),
              child: Text(
                message['avatar'],
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            if (message['unread'])
              Positioned(
                right: 0,
                top: 0,
                child: Container(
                  width: 12,
                  height: 12,
                  decoration: BoxDecoration(
                    color: AppColors.primary,
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.white, width: 2),
                  ),
                ),
              ),
          ],
        ),
        title: Row(
          children: [
            Expanded(
              child: Text(
                message['sender'],
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: message['unread'] ? FontWeight.bold : FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: _getTypeColor(message['type']).withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: _getTypeColor(message['type'])),
              ),
              child: Text(
                message['type'].toUpperCase(),
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  color: _getTypeColor(message['type']),
                ),
              ),
            ),
          ],
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            Text(
              message['lastMessage'],
              style: TextStyle(
                fontSize: 14,
                color: message['unread'] ? AppColors.textPrimary : AppColors.textSecondary,
                fontWeight: message['unread'] ? FontWeight.w500 : FontWeight.normal,
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 4),
            Text(
              message['timestamp'],
              style: const TextStyle(
                fontSize: 12,
                color: AppColors.textSecondary,
              ),
            ),
          ],
        ),
        onTap: () {
          // TODO: Navigate to chat screen
        },
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.message_outlined,
            size: 80,
            color: Colors.grey.shade400,
          ),
          const SizedBox(height: 16),
          Text(
            'No messages found',
            style: TextStyle(
              fontSize: 18,
              color: Colors.grey.shade600,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Messages will appear here when you receive them',
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey.shade500,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: () {
              // TODO: Navigate to support chat
            },
            icon: const Icon(Icons.headset_mic),
            label: const Text('Contact Support'),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Color _getAvatarColor(String type) {
    switch (type) {
      case 'support':
        return AppColors.primary;
      case 'customer':
        return AppColors.info;
      case 'system':
        return AppColors.warning;
      default:
        return AppColors.textSecondary;
    }
  }

  Color _getTypeColor(String type) {
    switch (type) {
      case 'support':
        return AppColors.primary;
      case 'customer':
        return AppColors.info;
      case 'system':
        return AppColors.warning;
      default:
        return AppColors.textSecondary;
    }
  }
}
