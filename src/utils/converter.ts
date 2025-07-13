import mammoth from 'mammoth';
import TurndownService from 'turndown';
import { ConversionResult, ConversionOptions, ImageData } from '../types';

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  fence: '```',
});

// Configure turndown rules
turndownService.addRule('lineBreak', {
  filter: 'br',
  replacement: () => '\n'
});

turndownService.addRule('image', {
  filter: 'img',
  replacement: (content, node) => {
    const alt = (node as HTMLElement).getAttribute('alt') || '';
    const src = (node as HTMLElement).getAttribute('src') || '';
    return `![${alt}](${src})`;
  }
});

export async function convertDocxToMarkdown(
  file: File, 
  options: ConversionOptions
): Promise<ConversionResult> {
  const warnings: string[] = [];
  const images: ImageData[] = [];
  
  try {
    // Convert DOCX to HTML with image extraction
    const result = await mammoth.convertToHtml(
      { arrayBuffer: await file.arrayBuffer() },
      {
        convertImage: mammoth.images.imgElement(async (image) => {
          try {
            // Generate filename
            const extension = image.contentType?.split('/')[1] || 'png';
            const filename = `image_${images.length + 1}.${extension}`;
            
            // Create blob from image data
            const blob = new Blob([image.buffer], { type: image.contentType });
            
            // Store image data
            const imageData: ImageData = {
              filename,
              data: blob,
              url: URL.createObjectURL(blob)
            };
            images.push(imageData);
            
            // Return image reference based on options
            if (options.inlineImages) {
              // Convert to base64 for inline embedding
              return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve({ src: reader.result as string });
                reader.readAsDataURL(blob);
              });
            } else {
              // Use relative path
              return { src: `${options.imagePrefix}${filename}` };
            }
          } catch (error) {
            warnings.push(`Failed to process image: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return { src: '' };
          }
        }),
        styleMap: [
          // Map DOCX styles to markdown
          "p[style-name='Code'] => pre",
          "p[style-name='CodeBlock'] => pre",
          "span[style-name='CodeChar'] => code",
        ]
      }
    );
    
    // Add mammoth warnings
    if (result.messages.length > 0) {
      warnings.push(...result.messages.map(msg => msg.message));
    }
    
    // Convert HTML to Markdown
    let markdown = turndownService.turndown(result.value);
    
    // Apply heading depth shift
    if (options.headingDepthShift > 0) {
      const shift = '#'.repeat(options.headingDepthShift);
      markdown = markdown.replace(/^(#{1,6})\s/gm, `$1${shift} `);
    }
    
    // Clean up markdown
    markdown = cleanupMarkdown(markdown);
    
    return {
      markdown,
      images,
      warnings
    };
    
  } catch (error) {
    throw new Error(`Failed to convert DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function cleanupMarkdown(markdown: string): string {
  return markdown
    // Remove excessive whitespace
    .replace(/\n{3,}/g, '\n\n')
    // Fix table formatting
    .replace(/\|\s*\|\s*\|/g, '| |')
    // Clean up list formatting
    .replace(/^(\s*)-\s*$/gm, '')
    // Remove empty paragraphs
    .replace(/^\s*$/gm, '')
    .trim();
}