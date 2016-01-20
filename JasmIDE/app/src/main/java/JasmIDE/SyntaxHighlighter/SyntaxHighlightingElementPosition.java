package JasmIDE.SyntaxHighlighter;

/**
 * Created by mops on 2016-01-20.
 */
public class SyntaxHighlightingElementPosition {
    protected int startPosition;
    protected int endPosition;

    public SyntaxHighlightingElementPosition(int startPosition, int endPosition) {
        setStartPosition(startPosition);
        setEndPosition(endPosition);
    }

    public void setStartPosition(int newStartPosition) {
        if(newStartPosition >= 0) startPosition = newStartPosition;
    }

    public void setEndPosition(int newEndPosition) {
        if(newEndPosition >= 1) endPosition = newEndPosition;
    }

    public int getStartPosition() {
        return startPosition;
    }

    public int getEndPosition() {
        return endPosition;
    }
}
