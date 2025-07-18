# Enhanced Transcript API Test Script
# This script tests the new enhanced transcript processing that stores the transcript in a variable
# and processes it with Gemini AI

Write-Host "🎬 Enhanced YouTube Transcript API Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Test URLs
$testUrls = @(
    "https://www.youtube.com/watch?v=yQq1-_ujXnM",  # Julian Treasure TED Talk
    "https://www.youtube.com/watch?v=TQMbvJNRpLE",  # Susan Pinker TED Talk 
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ"   # Rick Roll (has captions)
)

$baseUrl = "http://localhost:3000"

foreach ($url in $testUrls) {
    Write-Host "`n📋 Testing URL: $url" -ForegroundColor Yellow
    Write-Host "=" * 60 -ForegroundColor Yellow
    
    try {
        # Test the enhanced transcript API
        $apiUrl = "$baseUrl/api/enhanced-transcript?url=" + [System.Web.HttpUtility]::UrlEncode($url)
        Write-Host "🌐 Calling Enhanced API: $apiUrl" -ForegroundColor Blue
        
        $response = Invoke-RestMethod -Uri $apiUrl -Method GET
        
        if ($response.success) {
            Write-Host "✅ SUCCESS: Enhanced transcript processed!" -ForegroundColor Green
            Write-Host ""
            
            # Display transcript variable information
            Write-Host "📝 TRANSCRIPT VARIABLE DETAILS:" -ForegroundColor Magenta
            Write-Host "- Length: $($response.transcriptVariable.Length) characters" -ForegroundColor White
            Write-Host "- Word Count: $($response.metadata.wordCount)" -ForegroundColor White
            Write-Host "- Segment Count: $($response.metadata.segmentCount)" -ForegroundColor White
            Write-Host "- Duration: $([math]::Round($response.metadata.duration)) seconds" -ForegroundColor White
            Write-Host ""
            
            # Show preview of stored transcript variable
            Write-Host "📄 TRANSCRIPT VARIABLE PREVIEW (first 200 chars):" -ForegroundColor Cyan
            $preview = $response.transcriptVariable.Substring(0, [Math]::Min(200, $response.transcriptVariable.Length))
            Write-Host "$preview..." -ForegroundColor Gray
            Write-Host ""
            
            # Display AI analysis
            Write-Host "🤖 GEMINI AI ANALYSIS:" -ForegroundColor Green
            Write-Host "- Summary Length: $($response.aiAnalysis.summary.Length) characters" -ForegroundColor White
            Write-Host "- Key Topics: $($response.aiAnalysis.keyTopics.Count)" -ForegroundColor White
            if ($response.aiAnalysis.keyTopics.Count -gt 0) {
                Write-Host "- Topics: $($response.aiAnalysis.keyTopics -join ', ')" -ForegroundColor Gray
            }
            Write-Host ""
            
            # Show summary preview
            Write-Host "📊 AI SUMMARY PREVIEW:" -ForegroundColor Blue
            $summaryLines = $response.aiAnalysis.summary -split "`n" | Select-Object -First 3
            foreach ($line in $summaryLines) {
                if ($line.Trim()) {
                    Write-Host "  $line" -ForegroundColor Gray
                }
            }
            Write-Host ""
            
            # Display formatted transcript preview
            Write-Host "🕒 FORMATTED TRANSCRIPT WITH TIMESTAMPS (first 3 segments):" -ForegroundColor Yellow
            $segments = $response.transcript | Select-Object -First 3
            foreach ($segment in $segments) {
                $startTime = [math]::Floor([double]$segment.offset)
                $endTime = [math]::Floor([double]$segment.offset + [double]$segment.duration)
                $timeStamp = "${startTime}s-${endTime}s"
                Write-Host "[$timeStamp] $($segment.transcriptText)" -ForegroundColor Gray
            }
            Write-Host ""
            
        } else {
            Write-Host "❌ FAILED: $($response.error)" -ForegroundColor Red
        }
        
    } catch {
        Write-Host "💥 ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host "=" * 60 -ForegroundColor Yellow
}

Write-Host "`n🎯 Enhanced Transcript Test Summary:" -ForegroundColor Cyan
Write-Host "- Tests the new enhanced transcript processor" -ForegroundColor White
Write-Host "- Stores complete transcript in a variable" -ForegroundColor White  
Write-Host "- Processes with Gemini AI for analysis" -ForegroundColor White
Write-Host "- Generates formatted output with timestamps" -ForegroundColor White
Write-Host "- Provides AI summary, key topics, and insights" -ForegroundColor White

Write-Host "`n🌐 Test the UI at: $baseUrl/test-enhanced-transcript" -ForegroundColor Green
Write-Host "📋 Check console logs for detailed transcript variable information" -ForegroundColor Blue

Write-Host "`n✨ Enhanced Transcript API Test Complete!" -ForegroundColor Cyan 