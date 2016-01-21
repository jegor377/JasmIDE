package JasmIDE.AsmSyntaxHighlighter;

import android.graphics.Color;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import JasmIDE.AsmSyntaxHighlighter.AsmSyntaxHighlightLoaders.AsmSyntaxHighlightLoaderXML;
import JasmIDE.SyntaxHighlighter.SyntaxHighlightLoaders.SyntaxHighlightLoaderException;
import JasmIDE.SyntaxHighlighter.SyntaxHighlighter;
import JasmIDE.SyntaxHighlighter.SyntaxHighlightingColorElements;

public class AsmSyntaxHighlighter extends SyntaxHighlighter {
    public AsmSyntaxHighlighter(InputStream sourceFile) {
        elements = new ArrayList<>();
        //normal text color
        normalTextColor = Color.BLACK;
        loadSyntaxColorElementsFromXmlFile(sourceFile);
    }

    protected void loadSyntaxColorElementsFromXmlFile(InputStream sourceFile) {
        AsmSyntaxHighlightLoaderXML elementsLoader = new AsmSyntaxHighlightLoaderXML(sourceFile);
        try {
            elements = elementsLoader.loadSyntaxHighlighting();
        }
        catch(SyntaxHighlightLoaderException e)
        {
            ;
        }
    }
}
