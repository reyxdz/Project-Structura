from PIL import Image

# Load the logo
logo_path = 'react-project-structura/src/images/logo_v2.png'
img = Image.open(logo_path)

# Convert to RGBA if not already
img = img.convert('RGBA')

# Get image data
data = img.getdata()

# Convert to white version (for dark theme)
white_data = []
for item in data:
    if item[3] > 0:  # If not transparent
        white_data.append((255, 255, 255, item[3]))  # White with original alpha
    else:
        white_data.append(item)  # Keep transparent

white_img = Image.new('RGBA', img.size)
white_img.putdata(white_data)
white_img.save('react-project-structura/src/images/logo_v2_white.png')
print("Created logo_v2_white.png")

# Create dark version (for light theme) - using dark gray
dark_data = []
for item in data:
    if item[3] > 0:  # If not transparent
        dark_data.append((31, 41, 55, item[3]))  # Dark gray with original alpha
    else:
        dark_data.append(item)

dark_img = Image.new('RGBA', img.size)
dark_img.putdata(dark_data)
dark_img.save('react-project-structura/src/images/logo_v2_dark.png')
print("Created logo_v2_dark.png")
