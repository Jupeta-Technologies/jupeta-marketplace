#!/usr/bin/env python3
"""
Script to remove scattered media queries from SCSS file while preserving
the consolidated responsive design section at the end.
"""

import re

def cleanup_media_queries():
    # Read the SCSS file
    with open('src/styles/jupeta-ec-v1.global.scss', 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Find the start of our consolidated section
    consolidated_marker = "/* ============================================\n   CONSOLIDATED RESPONSIVE DESIGN"
    consolidated_start = content.find(consolidated_marker)
    
    if consolidated_start == -1:
        print("Could not find consolidated section marker")
        return
    
    # Split content into before and after consolidated section
    before_consolidated = content[:consolidated_start]
    consolidated_section = content[consolidated_start:]
    
    # Remove all @media queries from the before_consolidated part
    # This regex matches @media queries and their entire blocks
    media_query_pattern = r'@media[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}'
    
    # For simple one-liner media queries
    oneliner_pattern = r'@media[^{]*\{[^}]*\}'
    
    # Remove media queries
    before_consolidated = re.sub(media_query_pattern, '', before_consolidated, flags=re.MULTILINE | re.DOTALL)
    before_consolidated = re.sub(oneliner_pattern, '', before_consolidated, flags=re.MULTILINE)
    
    # Clean up extra whitespace and newlines
    before_consolidated = re.sub(r'\n\s*\n\s*\n', '\n\n', before_consolidated)
    
    # Reconstruct the file
    cleaned_content = before_consolidated + consolidated_section
    
    # Write back to file
    with open('src/styles/jupeta-ec-v1.global.scss', 'w', encoding='utf-8') as file:
        file.write(cleaned_content)
    
    print("✅ Successfully cleaned up scattered media queries!")
    print("🔄 Consolidated section preserved at the end")

if __name__ == "__main__":
    cleanup_media_queries()
