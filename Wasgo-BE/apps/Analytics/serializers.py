from rest_framework import serializers
from .models import WasteAnalytics, PerformanceMetrics, TrendAnalysis


class WasteAnalyticsSerializer(serializers.ModelSerializer):
    """Serializer for WasteAnalytics model"""
    
    class Meta:
        model = WasteAnalytics
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')


class PerformanceMetricsSerializer(serializers.ModelSerializer):
    """Serializer for PerformanceMetrics model"""
    
    class Meta:
        model = PerformanceMetrics
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')


class TrendAnalysisSerializer(serializers.ModelSerializer):
    """Serializer for TrendAnalysis model"""
    
    class Meta:
        model = TrendAnalysis
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')


