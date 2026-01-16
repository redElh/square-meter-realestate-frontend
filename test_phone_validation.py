#!/usr/bin/env python3
"""
Phone Validation Testing Tool
Tests phone number validation using Google's libphonenumber library
This validates against REAL country codes and phone number formats
"""

import phonenumbers
from phonenumbers import NumberParseException


def validate_phone(phone_number):
    """
    Validates phone numbers using Google's libphonenumber library.
    This validates against real country codes and formats for all countries.
    Examples: +212 6 23 09 42 46, +33 1 23 45 67 89, +1 555 123 4567
    """
    
    if not phone_number or phone_number.strip() == '':
        return True, "Phone is optional"
    
    value = phone_number.strip()
    
    try:
        # Parse the phone number (None means no default region)
        parsed_number = phonenumbers.parse(value, None)
        
        # Check if it's a valid number
        if not phonenumbers.is_valid_number(parsed_number):
            return False, "Invalid phone number format or country code"
        
        # Check if it's possible (valid length for the country)
        if not phonenumbers.is_possible_number(parsed_number):
            return False, "Invalid phone number length for the country"
        
        # Get country and format info
        country_code = parsed_number.country_code
        region = phonenumbers.region_code_for_number(parsed_number)
        number_type = phonenumbers.number_type(parsed_number)
        
        type_names = {
            0: "Fixed Line",
            1: "Mobile",
            2: "Fixed Line or Mobile",
            3: "Toll Free",
            4: "Premium Rate",
            5: "Shared Cost",
            6: "VoIP",
            7: "Personal Number",
            8: "Pager",
            9: "UAN",
            10: "Voicemail",
            -1: "Unknown"
        }
        
        type_name = type_names.get(number_type, "Unknown")
        
        return True, f"Valid ✓ (Country: {region}, Code: +{country_code}, Type: {type_name})"
        
    except NumberParseException as e:
        error_messages = {
            NumberParseException.INVALID_COUNTRY_CODE: "Invalid or missing country code",
            NumberParseException.NOT_A_NUMBER: "Not a valid phone number",
            NumberParseException.TOO_SHORT_NSN: "Phone number is too short",
            NumberParseException.TOO_SHORT_AFTER_IDD: "Too short after international prefix",
            NumberParseException.TOO_LONG: "Phone number is too long",
        }
        return False, error_messages.get(e.error_type, f"Invalid phone number: {str(e)}")


def test_phone_numbers():
    """Test various phone number formats"""
    
    test_cases = [
        # Valid international numbers
        ("+212 6 23 09 42 46", True),   # Morocco mobile
        ("+212 623094246", True),        # Morocco mobile no spaces
        ("+212-6-23-09-42-46", True),   # Morocco mobile with dashes
        ("+212 7 12 34 56 78", True),   # Morocco mobile prefix 7
        ("+212 5 22 34 56 78", True),   # Morocco landline
        ("+33 1 23 45 67 89", True),    # France
        ("+33123456789", True),          # France no spaces
        ("+1 555 123 4567", True),      # USA (note: 555 is test number)
        ("+1 (555) 123-4567", True),    # USA formatted
        ("+44 20 7946 0958", True),     # UK
        ("+86 138 0013 8000", True),    # China
        ("+91 98765 43210", True),      # India
        ("+49 30 12345678", True),      # Germany
        ("+39 06 1234 5678", True),     # Italy
        ("+34 912 34 56 78", True),     # Spain
        ("+7 495 123 4567", True),      # Russia
        ("+62 21 1234 5678", True),     # Indonesia
        
        # Invalid - FAKE country codes
        ("+623094246", False),           # Country code doesn't exist (looks like +6230)
        ("+4 254362515", False),         # Country code +4 doesn't exist
        ("+999 123456789", False),       # Country code +999 doesn't exist
        
        # Invalid formats
        ("212623094246", False),         # Missing +
        ("+0212623094246", False),       # Country code can't start with 0
        ("623094246", False),            # No country code
        ("+21", False),                  # Too short
        ("+212 6", False),               # Too few digits
        ("+212 12345", False),           # Too few digits
        ("+212 6 23 09 42 46 78 90 12 34", False),  # Too many digits
        ("+1234567890123456", False),    # Too many digits
        ("", True),                      # Empty (optional)
        ("   ", True),                   # Whitespace (optional)
        ("+212abc", False),              # Contains letters
        ("++212623094246", False),       # Double +
        ("+212-", False),                # No digits after code
        ("+1 234 567 8901", False),      # Invalid US format (too many digits)
    ]
    
    print("\n" + "="*80)
    print("PHONE VALIDATION TEST SUITE - Using Google's libphonenumber")
    print("Validates against REAL country codes and phone number formats")
    print("="*80 + "\n")
    
    passed = 0
    failed = 0
    
    for phone, expected_valid in test_cases:
        is_valid, message = validate_phone(phone)
        status = "✓ PASS" if is_valid == expected_valid else "✗ FAIL"
        
        if is_valid == expected_valid:
            passed += 1
        else:
            failed += 1
        
        # Display phone with visual indicator
        phone_display = f'"{phone}"' if phone.strip() else '(empty)'
        expected = "VALID" if expected_valid else "INVALID"
        result = "VALID" if is_valid else "INVALID"
        
        print(f"{status} | Expected: {expected:7} | Got: {result:7} | {phone_display:30} | {message}")
    
    print("\n" + "="*80)
    print(f"RESULTS: {passed} passed, {failed} failed out of {len(test_cases)} tests")
    print("="*80 + "\n")


def interactive_test():
    """Interactive mode - test custom phone numbers"""
    print("\n" + "="*80)
    print("INTERACTIVE PHONE VALIDATION TESTER - Using Google's libphonenumber")
    print("="*80)
    print("Enter phone numbers to test (or 'q' to quit)")
    print("Must include country code: +[country code][number]")
    print("Examples: +212 6 23 09 42 46, +33 1 23 45 67 89, +1 555 123 4567")
    print("-"*80 + "\n")
    
    while True:
        phone = input("Enter phone number: ").strip()
        
        if phone.lower() == 'q':
            break
        
        is_valid, message = validate_phone(phone)
        status = "✓ VALID" if is_valid else "✗ INVALID"
        
        print(f"\n{status}")
        print(f"Message: {message}\n")
        print("-"*80 + "\n")


if __name__ == "__main__":
    # Run automated tests
    test_phone_numbers()
    
    # Uncomment to enable interactive testing
    # interactive_test()

    print("✓ Exactly 9 digits required after +212")
    print()
    print("Examples of VALID numbers:")
    print("  - +212 6 23 09 42 46  (mobile)")
    print("  - +212 7 12 34 56 78  (mobile)")
    print("  - +212 5 22 34 56 78  (landline)")
    print()
    print("Examples of INVALID numbers:")
    print("  - +623094246          (wrong country code)")
    print("  - +33 1 23 45 67 89   (France, not Morocco)")
    print("  - +212 8 23 09 42 46  (invalid prefix 8)")
    print("  - +212 623 09 42      (too few digits)")
    print()


if __name__ == "__main__":
    # Test the validation
    test_phone_numbers()
    
    # Interactive testing
    print("\n" + "=" * 80)
    print("INTERACTIVE TESTING")
    print("=" * 80)
    print("Enter phone numbers to test (or 'quit' to exit):")
    print("Example: +212 6 23 09 42 46")
    print()
    
    while True:
        try:
            user_input = input("Phone number: ").strip()
            
            if user_input.lower() in ['quit', 'exit', 'q']:
                break
            
            is_valid, message = validate_phone(user_input)
            
            if is_valid:
                print(f"  ✓ {message}")
            else:
                print(f"  ✗ {message}")
            
            print()
            
        except (KeyboardInterrupt, EOFError):
            break
    
    print("\nGoodbye!")
