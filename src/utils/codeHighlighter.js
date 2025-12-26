const KEYWORD_REGEX = /\b(const|let|var|function|return|if|else|for|while|class|async|await)\b/g;

export const highlightCode = (code = '') => {
    if (typeof code !== 'string') return '';
    return code.replace(KEYWORD_REGEX, '<span class="text-[var(--color-blue)]">$1</span>');
};

export default highlightCode;
