const content = {
    "title": "Vidiwise",
    "description": "Turn any video into a smart knowledge base with AI-powered summaries, transcripts, and chat assistance",
    "home": {
        "header": {
            "title": "Vidiwise",
            "links" : [
                {
                    "id": 1, 
                    "title": "Home",
                    "url": "/",
                    "active": true
                }, 
                {
                    "id": 2, 
                    "title": "Features",
                    "url": "#features",
                    "active": false
                },
                {
                    "id": 3,
                    "title": "Dashboard",
                    "url": "/generate",
                    "active": false
                }
            ],
            "button": 
                {
                    "id": 1,
                    "title": "Start Exploring",
                    "arrow": "",
                    "url": "/generate"
                }
            
        },
        "hero": {
            "title": ["Turn any video into", "smart knowledge."],
            "subtitle": "Paste a YouTube link, get instant transcripts, AI summaries, and chat with video content. Free to use, no payment required.",
            "button": "Start Exploring",
            "cta_secondary": "Try it Free"
        },
        "usecases": {
            "title": ["Perfect", "for", "Everyone"],
            "usecase": [
                {
                    "id": 1, 
                    "height" : 280,
                    "title": "Content Creators", 
                    "icon": "/images/usecases/creator.png",
                    "desc": "Transform videos into engaging knowledge bases and boost audience interaction"
                },
                {
                    "id": 2, 
                    "height" : 310,
                    "title": "Students", 
                    "icon": "/images/usecases/student.png",
                    "desc": "Extract key insights from lectures with AI summaries and interactive chat"
                },
                {
                    "id": 3, 
                    "height" : 310,
                    "title": "Podcast Hosts", 
                    "icon": "/images/usecases/podcast.png",
                    "desc": "Generate show notes, searchable transcripts, and episode highlights instantly"
                },
                {
                    "id": 4, 
                    "height" : 280,
                    "title": "Researchers", 
                    "icon": "/images/usecases/research.png",
                    "desc": "Extract insights and quotes from interviews and documentaries with AI assistance"
                },
            ]
        },
        "steps":{
            "title": ["Three", "simple steps"],
            "steps": [
                {
                    "id": 1, 
                    "title": "Instant Transcripts",
                    "desc": "Get accurate, timestamped transcripts for any YouTube video in seconds", 
                    "button": "Try Now",
                    "type": 1,
                    "boxOut" : "bg-light-blue",
                    "boxIn" : "bg-lighter-blue",
                    "image": "/images/steps/step.svg"
                },
                {
                    "id": 2, 
                    "title": "AI-Powered Summaries",
                    "desc": "Understand key points instantly with intelligent video summarization", 
                    "button": "Try Now",
                    "type": 2,
                    "boxOut" : "bg-light-pink",
                    "boxIn" : "bg-lighter-pink",
                    "image": "/images/steps/step-2.svg"
                },
                {
                    "id": 3, 
                    "title": "Chat with Videos",
                    "desc": "Ask questions and get insights from video content using AI chat", 
                    "button": "Try Now",
                    "type": 1,
                    "boxOut" : "bg-light-darkBlue",
                    "boxIn" : "bg-lighter-darkBlue",
                    "image": "/images/steps/step.svg"
                }
            ]
        },
        "keyFeatures": {
            "title": ["Powerful features for", "video knowledge extraction"],
            "subtitle": "",
            "features": [
                "Instant transcript generation",
                "AI-powered video summarizer", 
                "Interactive chat with content",
                "Free to use, no limits"
            ]
        }
    }
}

export default content;