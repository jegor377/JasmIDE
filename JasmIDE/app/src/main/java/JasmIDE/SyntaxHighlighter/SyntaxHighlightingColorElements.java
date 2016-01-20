package JasmIDE.SyntaxHighlighter;

public class SyntaxHighlightingColorElements {
    protected int color;
    protected String[] words;

    public SyntaxHighlightingColorElements(String[] words, int color) {
        this.color = color;
        this.words = words;
    }
}
