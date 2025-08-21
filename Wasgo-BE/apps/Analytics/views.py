from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Avg, Count, Sum, Q
from django.utils import timezone
from datetime import datetime, timedelta

from .models import WasteAnalytics, PerformanceMetrics, TrendAnalysis
from .serializers import (
    WasteAnalyticsSerializer,
    PerformanceMetricsSerializer,
    TrendAnalysisSerializer,
)


class WasteAnalyticsViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for waste analytics data"""
    
    queryset = WasteAnalytics.objects.all()
    serializer_class = WasteAnalyticsSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get summary analytics for dashboard"""
        today = timezone.now().date()
        last_month = today - timedelta(days=30)
        
        # Get latest analytics
        latest_analytics = self.queryset.filter(
            period_start__gte=last_month
        ).order_by('-period_start').first()
        
        if latest_analytics:
            serializer = self.get_serializer(latest_analytics)
            return Response(serializer.data)
        
        return Response({
            'message': 'No analytics data available for the last 30 days'
        }, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'])
    def trends(self, request):
        """Get trend data for charts"""
        period_type = request.query_params.get('period_type', 'monthly')
        days = request.query_params.get('days', 90)
        
        start_date = timezone.now().date() - timedelta(days=int(days))
        
        analytics = self.queryset.filter(
            period_type=period_type,
            period_start__gte=start_date
        ).order_by('period_start')
        
        serializer = self.get_serializer(analytics, many=True)
        return Response(serializer.data)


class PerformanceMetricsViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for performance metrics"""
    
    queryset = PerformanceMetrics.objects.all()
    serializer_class = PerformanceMetricsSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def current_status(self, request):
        """Get current performance status"""
        metric_type = request.query_params.get('metric_type')
        
        queryset = self.queryset
        if metric_type:
            queryset = queryset.filter(metric_type=metric_type)
        
        # Get latest metrics for each type
        latest_metrics = {}
        for metric in queryset.order_by('metric_type', '-period_end'):
            if metric.metric_type not in latest_metrics:
                latest_metrics[metric.metric_type] = self.get_serializer(metric).data
        
        return Response(latest_metrics)


class TrendAnalysisViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for trend analysis"""
    
    queryset = TrendAnalysis.objects.all()
    serializer_class = TrendAnalysisSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def significant_changes(self, request):
        """Get trends with significant changes"""
        significant_trends = self.queryset.filter(
            change_percentage__gte=5  # 5% or more change
        ).order_by('-period_end')
        
        serializer = self.get_serializer(significant_trends, many=True)
        return Response(serializer.data)


