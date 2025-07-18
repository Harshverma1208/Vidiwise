Write-Host "=== TESTING VIDIWISE TRANSCRIPT ENDPOINTS ===" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000"
$testUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"

# Test endpoints
$endpoints = @(
    @{name="Main Transcript API"; url="$baseUrl/api/transcript?url=$testUrl"},
    @{name="Production Transcript API"; url="$baseUrl/api/transcript-production?url=$testUrl"},
    @{name="Demo Transcript API"; url="$baseUrl/api/transcript-demo?url=$testUrl"},
    @{name="Improved Transcript Test"; url="$baseUrl/api/test-improved"},
    @{name="Video ID Test"; url="$baseUrl/api/test-video-id?url=$testUrl"}
)

foreach ($endpoint in $endpoints) {
    Write-Host "Testing: $($endpoint.name)" -ForegroundColor Yellow
    Write-Host "URL: $($endpoint.url)" -ForegroundColor Gray
    
    try {
        $response = Invoke-RestMethod -Uri $endpoint.url -Method Get -TimeoutSec 30
        
        if ($response.success -eq $true) {
            Write-Host "✅ SUCCESS" -ForegroundColor Green
            if ($response.transcriptLength) {
                Write-Host "   Transcript segments: $($response.transcriptLength)" -ForegroundColor Green
            }
            if ($response.transcript -and $response.transcript.Count) {
                Write-Host "   Transcript array length: $($response.transcript.Count)" -ForegroundColor Green
            }
            if ($response.source) {
                Write-Host "   Source: $($response.source)" -ForegroundColor Green
            }
            if ($response.isRealTranscript -ne $null) {
                Write-Host "   Real transcript: $($response.isRealTranscript)" -ForegroundColor Green
            }
        } else {
            Write-Host "❌ FAILED" -ForegroundColor Red
            if ($response.error) {
                Write-Host "   Error: $($response.error)" -ForegroundColor Red
            }
            if ($response.message) {
                Write-Host "   Message: $($response.message)" -ForegroundColor Red
            }
        }
    }
    catch {
        Write-Host "❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

Write-Host "=== TESTING COMPLETE ===" -ForegroundColor Cyan 