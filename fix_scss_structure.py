#!/usr/bin/env python3

import re

def fix_scss_braces(file_path):
    """Fix SCSS file structure by removing orphaned braces and fixing indentation"""
    
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    fixed_lines = []
    brace_stack = []
    in_selector = False
    current_selector = ""
    
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()
        
        # Skip empty lines
        if not stripped:
            fixed_lines.append(line)
            i += 1
            continue
            
        # Check for comments
        if stripped.startswith('/*') or stripped.startswith('//'):
            fixed_lines.append(line)
            i += 1
            continue
            
        # Count leading spaces for indentation
        indent_level = len(line) - len(line.lstrip())
        
        # Check for opening braces
        if '{' in stripped:
            # This is a selector or rule
            selector_part = stripped.split('{')[0].strip()
            if selector_part:
                fixed_lines.append(f"{selector_part} {{\n")
                brace_stack.append(selector_part)
                in_selector = True
            i += 1
            continue
            
        # Check for closing braces
        if stripped == '}':
            if brace_stack:
                brace_stack.pop()
                fixed_lines.append("}\n")
            # Skip orphaned closing braces
            i += 1
            continue
            
        # Handle property lines
        if ':' in stripped and not stripped.endswith('{'):
            # This is a CSS property
            fixed_lines.append(line)
            i += 1
            continue
            
        # Handle selector lines without opening brace
        if not stripped.endswith('{') and not ':' in stripped and not stripped == '}':
            # Check if next line has opening brace
            if i + 1 < len(lines) and lines[i + 1].strip().startswith('{'):
                fixed_lines.append(f"{stripped} {{\n")
                i += 2  # Skip the next line with opening brace
                brace_stack.append(stripped)
                continue
            else:
                # This might be a standalone selector, add opening brace
                fixed_lines.append(f"{stripped} {{\n")
                brace_stack.append(stripped)
                i += 1
                continue
        
        # Default: keep the line as is
        fixed_lines.append(line)
        i += 1
    
    # Close any remaining open braces
    while brace_stack:
        brace_stack.pop()
        fixed_lines.append("}\n")
    
    return fixed_lines

def main():
    file_path = "/Users/kobinay/JupetAlpha/jupeta-marketplace/src/styles/jupeta-ec-v1.global.scss"
    
    print("Fixing SCSS file structure...")
    
    # Create backup
    import shutil
    backup_path = file_path + ".backup"
    shutil.copy2(file_path, backup_path)
    print(f"Backup created: {backup_path}")
    
    # Fix the file
    fixed_lines = fix_scss_braces(file_path)
    
    # Write fixed content
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(fixed_lines)
    
    print(f"Fixed SCSS file. Total lines: {len(fixed_lines)}")
    print("Done!")

if __name__ == "__main__":
    main()
