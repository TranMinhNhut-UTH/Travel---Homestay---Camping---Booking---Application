namespace ev_dealer_reporting.DTOs
{
    public class DemandForecastDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public DateTime GeneratedAt { get; set; }
        public List<ForecastDatapointDto> ForecastData { get; set; } = new List<ForecastDatapointDto>();
        public ForecastSummaryDto? Summary { get; set; }
    }

    public class ForecastDatapointDto
    {
        public string? Period { get; set; } // e.g., "2025-12", "2026-01"
        public double ForecastedValue { get; set; }
        public double? ConfidenceLowerBound { get; set; }
        public double? ConfidenceUpperBound { get; set; }
    }

    public class ForecastSummaryDto
    {
        public double NextPeriodForecast { get; set; }
        public string? TrendDirection { get; set; } // "Increasing", "Decreasing", "Stable"
        public double TrendStrength { get; set; } // e.g., percentage growth
    }
}
