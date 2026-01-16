"""
Flask API for Translation Service
Can be deployed separately or integrated with the main application
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

# Add the services directory to path
sys.path.insert(0, os.path.dirname(__file__))

from services.translation_service import translate_email_content

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'translation-api',
        'version': '1.0.0'
    })


@app.route('/translate', methods=['POST'])
def translate():
    """
    Translate text to French
    
    Request body:
    {
        "text": "Text to translate",
        "source_lang": "en"  // optional, defaults to 'auto'
    }
    
    Response:
    {
        "success": true,
        "translated_text": "Texte traduit",
        "source_lang": "en",
        "target_lang": "fr"
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({
                'success': False,
                'error': 'Missing required field: text'
            }), 400
        
        text = data['text']
        source_lang = data.get('source_lang', 'auto')
        
        from services.translation_service import TranslationService
        service = TranslationService()
        translated = service.translate_to_french(text, source_lang)
        
        return jsonify({
            'success': True,
            'translated_text': translated,
            'source_lang': source_lang,
            'target_lang': 'fr'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/translate-email', methods=['POST'])
def translate_email():
    """
    Translate email subject and content to French
    
    Request body:
    {
        "subject": "Email subject",
        "content": "Email body content",
        "source_lang": "en"  // optional
    }
    
    Response:
    {
        "success": true,
        "translated_subject": "Sujet de l'email",
        "translated_content": "Contenu du corps de l'email",
        "source_lang": "en",
        "target_lang": "fr"
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'subject' not in data or 'content' not in data:
            return jsonify({
                'success': False,
                'error': 'Missing required fields: subject and content'
            }), 400
        
        subject = data['subject']
        content = data['content']
        source_lang = data.get('source_lang', 'en')
        
        translated_subject, translated_content = translate_email_content(
            subject, content, source_lang
        )
        
        return jsonify({
            'success': True,
            'translated_subject': translated_subject,
            'translated_content': translated_content,
            'source_lang': source_lang,
            'target_lang': 'fr'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('DEBUG', 'False').lower() == 'true'
    
    print(f"""
    ╔══════════════════════════════════════════╗
    ║   Translation API Server                 ║
    ║   Port: {port}                          ║
    ║   Debug: {debug}                        ║
    ╚══════════════════════════════════════════╝
    """)
    
    app.run(host='0.0.0.0', port=port, debug=debug)
