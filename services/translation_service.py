"""
Python Translation Service for Square Meter Real Estate
Uses multiple translation backends with fallbacks
Supports: LibreTranslate, Google Translate (unofficial), DeepL, Azure
"""

import os
import json
import requests
from typing import Dict, Optional, Tuple


class TranslationService:
    """
    Multi-backend translation service with automatic fallback
    """
    
    def __init__(self):
        self.libretranslate_url = os.getenv('LIBRETRANSLATE_URL', 'https://libretranslate.com/translate')
        self.deepl_api_key = os.getenv('DEEPL_API_KEY', '')
        self.azure_key = os.getenv('AZURE_TRANSLATOR_KEY', '')
        self.azure_endpoint = os.getenv('AZURE_TRANSLATOR_ENDPOINT', '')
        self.azure_region = os.getenv('AZURE_TRANSLATOR_REGION', 'westeurope')
    
    def translate_to_french(self, text: str, source_lang: str = 'auto') -> str:
        """
        Translate text to French using available backends
        
        Args:
            text: Text to translate
            source_lang: Source language code (e.g., 'en', 'es', 'de', 'auto')
            
        Returns:
            Translated text in French
        """
        # Try backends in order of preference
        backends = [
            self._translate_with_deepl,
            self._translate_with_azure,
            self._translate_with_libretranslate,
            self._translate_with_google_unofficial,
        ]
        
        for backend in backends:
            try:
                translated = backend(text, source_lang, 'fr')
                if translated:
                    return translated
            except Exception as e:
                print(f"Backend {backend.__name__} failed: {e}")
                continue
        
        # If all backends fail, return original text
        print("Warning: All translation backends failed, returning original text")
        return text
    
    def _translate_with_libretranslate(self, text: str, source: str, target: str) -> Optional[str]:
        """Translate using LibreTranslate (free, open-source)"""
        response = requests.post(
            self.libretranslate_url,
            json={
                'q': text,
                'source': source if source != 'auto' else 'auto',
                'target': target,
                'format': 'text',
            },
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            return data.get('translatedText')
        return None
    
    def _translate_with_deepl(self, text: str, source: str, target: str) -> Optional[str]:
        """Translate using DeepL API (requires API key)"""
        if not self.deepl_api_key:
            return None
            
        response = requests.post(
            'https://api-free.deepl.com/v2/translate',
            data={
                'auth_key': self.deepl_api_key,
                'text': text,
                'source_lang': source.upper() if source != 'auto' else None,
                'target_lang': target.upper(),
            },
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            translations = data.get('translations', [])
            if translations:
                return translations[0].get('text')
        return None
    
    def _translate_with_azure(self, text: str, source: str, target: str) -> Optional[str]:
        """Translate using Azure Translator (requires subscription)"""
        if not self.azure_key or not self.azure_endpoint:
            return None
            
        headers = {
            'Ocp-Apim-Subscription-Key': self.azure_key,
            'Ocp-Apim-Subscription-Region': self.azure_region,
            'Content-Type': 'application/json',
        }
        
        params = {
            'api-version': '3.0',
            'to': target,
        }
        
        if source != 'auto':
            params['from'] = source
        
        body = [{'text': text}]
        
        response = requests.post(
            f'{self.azure_endpoint}/translate',
            params=params,
            headers=headers,
            json=body,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if data and data[0].get('translations'):
                return data[0]['translations'][0].get('text')
        return None
    
    def _translate_with_google_unofficial(self, text: str, source: str, target: str) -> Optional[str]:
        """
        Translate using unofficial Google Translate API
        Note: This is not recommended for production use
        """
        try:
            from googletrans import Translator
            translator = Translator()
            result = translator.translate(text, src=source if source != 'auto' else 'auto', dest=target)
            return result.text
        except ImportError:
            print("googletrans not installed. Install with: pip install googletrans==4.0.0rc1")
            return None
        except Exception as e:
            print(f"Google Translate error: {e}")
            return None


def translate_email_content(subject: str, content: str, source_lang: str = 'en') -> Tuple[str, str]:
    """
    Translate email subject and content to French
    
    Args:
        subject: Email subject
        content: Email body content
        source_lang: Source language code
        
    Returns:
        Tuple of (translated_subject, translated_content)
    """
    service = TranslationService()
    
    translated_subject = service.translate_to_french(subject, source_lang)
    translated_content = service.translate_to_french(content, source_lang)
    
    return translated_subject, translated_content


# Example usage
if __name__ == '__main__':
    # Test translation
    service = TranslationService()
    
    test_text_en = "Hello, I am interested in selling my property."
    test_text_es = "Hola, estoy interesado en vender mi propiedad."
    test_text_de = "Hallo, ich bin daran interessiert, meine Immobilie zu verkaufen."
    
    print("English to French:")
    print(service.translate_to_french(test_text_en, 'en'))
    print()
    
    print("Spanish to French:")
    print(service.translate_to_french(test_text_es, 'es'))
    print()
    
    print("German to French:")
    print(service.translate_to_french(test_text_de, 'de'))
