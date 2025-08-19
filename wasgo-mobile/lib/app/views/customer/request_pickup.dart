import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:bytedev/core/theme/app_colors.dart';
import 'package:bytedev/core/widgets/app_button.dart';
import 'package:bytedev/core/widgets/app_text_field.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:bytedev/app/redux/states/app_state.dart';
import 'package:bytedev/app/controllers/customer_controller.dart';
import 'package:redux/redux.dart';

class RequestPickupView extends StatefulWidget {
  const RequestPickupView({Key? key}) : super(key: key);

  @override
  State<RequestPickupView> createState() => _RequestPickupViewState();
}

class _RequestPickupViewState extends State<RequestPickupView> {
  final _formKey = GlobalKey<FormState>();
  final _addressController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _quantityController = TextEditingController();
  
  String _selectedWasteType = 'General';
  String _selectedUrgency = 'Regular';
  DateTime _selectedDate = DateTime.now();
  TimeOfDay _selectedTime = TimeOfDay.now();

  final List<String> _wasteTypes = [
    'General',
    'Recyclable',
    'Organic',
    'Hazardous',
    'Electronic',
    'Construction',
  ];

  final List<String> _urgencyLevels = [
    'Regular',
    'Urgent',
    'Scheduled',
  ];

  @override
  void dispose() {
    _addressController.dispose();
    _descriptionController.dispose();
    _quantityController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return StoreConnector<AppState, _ViewModel>(
      converter: (store) => _ViewModel(
        state: store.state,
        controller: CustomerController(store),
      ),
      builder: (context, vm) {
        return Scaffold(
          backgroundColor: AppColors.background,
          appBar: AppBar(
            title: const Text('Request Pickup'),
            backgroundColor: AppColors.primary,
            elevation: 0,
          ),
          body: SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildSectionTitle('Pickup Details'),
                  const SizedBox(height: 16),
                  _buildWasteTypeSelector(),
                  const SizedBox(height: 16),
                  AppTextField(
                    controller: _quantityController,
                    hintText: 'Estimated quantity (kg)',
                    keyboardType: TextInputType.number,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter quantity';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),
                  AppTextField(
                    controller: _descriptionController,
                    hintText: 'Description (optional)',
                    maxLines: 3,
                  ),
                  const SizedBox(height: 24),
                  _buildSectionTitle('Pickup Location'),
                  const SizedBox(height: 16),
                  AppTextField(
                    controller: _addressController,
                    hintText: 'Pickup address',
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter pickup address';
                      }
                      return null;
                    },
                    suffixIcon: IconButton(
                      icon: const Icon(Icons.my_location),
                      onPressed: _getCurrentLocation,
                    ),
                  ),
                  const SizedBox(height: 24),
                  _buildSectionTitle('Schedule'),
                  const SizedBox(height: 16),
                  _buildUrgencySelector(),
                  const SizedBox(height: 16),
                  if (_selectedUrgency == 'Scheduled') ...[
                    _buildDateTimePicker(),
                    const SizedBox(height: 16),
                  ],
                  const SizedBox(height: 32),
                  AppButton(
                    text: 'Submit Request',
                    onPressed: vm.state.customerState.isLoading
                        ? null
                        : () => _submitRequest(vm),
                    isLoading: vm.state.customerState.isLoading,
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontSize: 18,
        fontWeight: FontWeight.bold,
      ),
    );
  }

  Widget _buildWasteTypeSelector() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey.shade300),
        borderRadius: BorderRadius.circular(8),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          value: _selectedWasteType,
          isExpanded: true,
          onChanged: (String? newValue) {
            setState(() {
              _selectedWasteType = newValue!;
            });
          },
          items: _wasteTypes.map<DropdownMenuItem<String>>((String value) {
            return DropdownMenuItem<String>(
              value: value,
              child: Text(value),
            );
          }).toList(),
        ),
      ),
    );
  }

  Widget _buildUrgencySelector() {
    return Row(
      children: _urgencyLevels.map((level) {
        return Expanded(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 4),
            child: ChoiceChip(
              label: Text(level),
              selected: _selectedUrgency == level,
              onSelected: (selected) {
                if (selected) {
                  setState(() {
                    _selectedUrgency = level;
                  });
                }
              },
              selectedColor: AppColors.primary,
              labelStyle: TextStyle(
                color: _selectedUrgency == level ? Colors.white : Colors.black,
              ),
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildDateTimePicker() {
    return Row(
      children: [
        Expanded(
          child: InkWell(
            onTap: _selectDate,
            child: Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                border: Border.all(color: Colors.grey.shade300),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                children: [
                  const Icon(Icons.calendar_today, size: 20),
                  const SizedBox(width: 8),
                  Text(
                    '${_selectedDate.day}/${_selectedDate.month}/${_selectedDate.year}',
                  ),
                ],
              ),
            ),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: InkWell(
            onTap: _selectTime,
            child: Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                border: Border.all(color: Colors.grey.shade300),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                children: [
                  const Icon(Icons.access_time, size: 20),
                  const SizedBox(width: 8),
                  Text(_selectedTime.format(context)),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  void _getCurrentLocation() {
    // TODO: Implement location fetching
    _addressController.text = 'Current Location';
  }

  void _selectDate() async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 30)),
    );
    if (picked != null && picked != _selectedDate) {
      setState(() {
        _selectedDate = picked;
      });
    }
  }

  void _selectTime() async {
    final TimeOfDay? picked = await showTimePicker(
      context: context,
      initialTime: _selectedTime,
    );
    if (picked != null && picked != _selectedTime) {
      setState(() {
        _selectedTime = picked;
      });
    }
  }

  void _submitRequest(_ViewModel vm) {
    if (_formKey.currentState!.validate()) {
      final pickupData = {
        'waste_type': _selectedWasteType,
        'quantity': _quantityController.text,
        'description': _descriptionController.text,
        'address': _addressController.text,
        'urgency': _selectedUrgency,
        'scheduled_date': _selectedUrgency == 'Scheduled'
            ? _selectedDate.toIso8601String()
            : null,
        'scheduled_time': _selectedUrgency == 'Scheduled'
            ? '${_selectedTime.hour}:${_selectedTime.minute}'
            : null,
      };

      vm.controller.requestPickup(pickupData);
      
      // Show success message
      Get.snackbar(
        'Success',
        'Pickup request submitted successfully',
        backgroundColor: Colors.green,
        colorText: Colors.white,
      );
      
      // Navigate back
      Get.back();
    }
  }
}

class _ViewModel {
  final AppState state;
  final CustomerController controller;

  _ViewModel({
    required this.state,
    required this.controller,
  });
}