package JasmIDE.SyntaxHighlighter.SyntaxHighlightLoaders;

import java.io.InputStream;
import java.util.List;

import JasmIDE.SyntaxHighlighter.SyntaxHighlightingColorElements;

public abstract class SyntaxHighlightLoader {
    public InputStream sourceFile;

    public abstract List<SyntaxHighlightingColorElements> loadSyntaxHighlighting() throws SyntaxHighlightLoaderException;
}
