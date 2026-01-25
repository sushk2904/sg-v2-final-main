import re
from io import BytesIO
from PyPDF2 import PdfReader

def extract_text_from_pdf(file_content: bytes) -> tuple[str, list[str]]:
    """
    Extract text AND valid hyperlinks from a PDF file efficiently.
    Returns (text, list_of_urls)
    """
    text = ""
    links = []
    
    try:
        reader = PdfReader(BytesIO(file_content))
        
        for page in reader.pages:
            # Extract Text
            content = page.extract_text()
            if content:
                text += content + "\n"
            
            # Extract Links from Key/Value Annotations
            if "/Annots" in page:
                for annot in page["/Annots"]:
                    obj = annot.get_object()
                    if "/A" in obj and "/URI" in obj["/A"]:
                        uri = obj["/A"]["/URI"]
                        if uri:
                            links.append(str(uri))
                            
    except Exception as e:
        print(f"Error extracting PDF data: {e}")
        
    return text, links

def extract_links_and_profiles(text: str, links: list[str] = None):
    """
    Scan text and raw links for GitHub and LeetCode profiles.
    """
    if links is None:
        links = []
        
    # Regex patterns
    # Matches: github.com/user, https://github.com/user, www.github.com/user
    github_pattern = r"(?:github\.com\/)([a-zA-Z0-9-]+)(?:\/)?"
    
    # Matches: leetcode.com/user, leetcode.com/u/user
    leetcode_pattern = r"(?:leetcode\.com\/)(?:u\/)?([a-zA-Z0-9_]+)(?:\/)?"
    
    found_github = set()
    found_leetcode = set()
    
    # 1. Check extracted raw links (Highest Confidence)
    for link in links:
        g_match = re.search(github_pattern, link, re.IGNORECASE)
        if g_match:
            found_github.add(g_match.group(1))
            
        l_match = re.search(leetcode_pattern, link, re.IGNORECASE)
        if l_match:
            found_leetcode.add(l_match.group(1))

    # 2. Check plain text (Fallback)
    if not found_github:
        text_g_matches = re.findall(github_pattern, text, re.IGNORECASE)
        for match in text_g_matches:
             if match.lower() not in ['site', 'about', 'contact', 'login', 'signup', 'topics', 'features']:
                found_github.add(match)

    if not found_leetcode:
         text_l_matches = re.findall(leetcode_pattern, text, re.IGNORECASE)
         for match in text_l_matches:
             found_leetcode.add(match)
    
    return {
        "github_username": list(found_github)[0] if found_github else None,
        "leetcode_username": list(found_leetcode)[0] if found_leetcode else None,
        "email": None
    }

def extract_candidate_info(text: str, links: list[str] = None):
    """
    Extract profiles and contact info (Email).
    """
    if links is None: links = []
    
    # 1. Profiles (GitHub/LeetCode)
    profile_data = extract_links_and_profiles(text, links)
    
    # 2. Email Extraction
    email_pattern = r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
    email_match = re.search(email_pattern, text)
    
    # 3. Name Extraction (Heuristic: First non-empty line)
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    name = lines[0] if lines else None
    
    # Basic cleanup: if name looks like title, take next line
    if name and name.lower() in ['resume', 'cv', 'curriculum vitae', 'profile']:
        name = lines[1] if len(lines) > 1 else name
    
    # Merge
    profile_data["email"] = email_match.group(0) if email_match else None
    profile_data["name"] = name
    
    return profile_data
