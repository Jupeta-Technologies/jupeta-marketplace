#!/usr/bin/env python3

def validate_scss_braces(file_path):
    """Validate and report brace mismatches in SCSS file"""
    
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    brace_stack = []
    in_comment = False
    in_string = False
    
    for i, line in enumerate(lines, 1):
        clean_line = line.strip()
        
        # Skip empty lines
        if not clean_line:
            continue
            
        # Handle multi-line comments
        if '/*' in clean_line and '*/' not in clean_line:
            in_comment = True
            continue
        elif '*/' in clean_line and in_comment:
            in_comment = False
            continue
        elif in_comment:
            continue
            
        # Skip single-line comments
        if clean_line.startswith('//'):
            continue
            
        # Count braces
        open_braces = clean_line.count('{')
        close_braces = clean_line.count('}')
        
        # Add opening braces to stack
        for _ in range(open_braces):
            brace_stack.append(i)
            
        # Remove closing braces from stack
        for _ in range(close_braces):
            if brace_stack:
                brace_stack.pop()
            else:
                print(f"ERROR: Unmatched closing brace '}}' at line {i}")
                print(f"Line content: {clean_line}")
                return i
    
    if brace_stack:
        print(f"ERROR: {len(brace_stack)} unclosed opening braces")
        for line_num in brace_stack[-5:]:  # Show last 5 unclosed braces
            print(f"  Unclosed '{{' at line {line_num}")
    
    return None

def main():
    file_path = "/Users/kobinay/JupetAlpha/jupeta-marketplace/src/styles/jupeta-ec-v1.global.scss"
    
    print("Validating SCSS brace structure...")
    error_line = validate_scss_braces(file_path)
    
    if error_line:
        print(f"\nFirst error found at line {error_line}")
    else:
        print("All braces are properly matched!")

if __name__ == "__main__":
    main()
