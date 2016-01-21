package JasmIDE.AsmSyntaxHighlighter.AsmSyntaxHighlightLoaders;

import android.graphics.Color;
import android.util.Xml;

import org.xmlpull.v1.XmlPullParser;
import org.xmlpull.v1.XmlPullParserException;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import JasmIDE.SyntaxHighlighter.SyntaxHighlightLoaders.SyntaxHighlightLoader;
import JasmIDE.SyntaxHighlighter.SyntaxHighlightLoaders.SyntaxHighlightLoaderException;
import JasmIDE.SyntaxHighlighter.SyntaxHighlightingColorElements;

public class AsmSyntaxHighlightLoaderXML extends SyntaxHighlightLoader {
    private static final String ns = null;

    public AsmSyntaxHighlightLoaderXML(InputStream sourceFile) {
        this.sourceFile = sourceFile;
    }

    @Override
    public List<SyntaxHighlightingColorElements> loadSyntaxHighlighting() throws SyntaxHighlightLoaderException{
        List<SyntaxHighlightingColorElements> result = new ArrayList<>();
        try {
            if(sourceFile != null) {
                result = parseXMLSyntaxFile(sourceFile);
                return result;
            }
        }
        catch(Exception e) {
            throw new SyntaxHighlightLoaderException(e.getMessage());
        }
        finally {
            try
            {
                sourceFile.close();
            }
            catch (Exception ex)
            {
                throw new SyntaxHighlightLoaderException(ex.getMessage());
            }
        }
        return result;
    }

    protected List parseXMLSyntaxFile(InputStream fileStream) throws IOException, XmlPullParserException {
        try {
            XmlPullParser parser = Xml.newPullParser();
            parser.setFeature(XmlPullParser.FEATURE_PROCESS_NAMESPACES, false);
            parser.setInput(fileStream, null);
            parser.nextTag();
            return readSyntaxColorElements(parser);
        } finally {
            fileStream.close();
        }
    }

    protected List readSyntaxColorElements(XmlPullParser parser) throws XmlPullParserException, IOException {
        List SyntaxColorElements = new ArrayList();

        parser.require(XmlPullParser.START_TAG, ns, "SyntaxColorElements");
        while (parser.next() != XmlPullParser.END_TAG) {
            if (parser.getEventType() != XmlPullParser.START_TAG) {
                continue;
            }
            String name = parser.getName();
            // Starts by looking for the entry tag
            if (name.equals("SyntaxColorElement")) {
                SyntaxColorElements.add(readSyntaxColorElement(parser));
            } else {
                skip(parser);
            }
        }
        return SyntaxColorElements;
    }

    protected SyntaxHighlightingColorElements readSyntaxColorElement(XmlPullParser parser) throws IOException, XmlPullParserException {
        parser.require(XmlPullParser.START_TAG, ns, "SyntaxColorElement");
        String color = parser.getAttributeValue(null, "color");
        List<String> words = new ArrayList();
        while (parser.next() != XmlPullParser.END_TAG) {
            if (parser.getEventType() != XmlPullParser.START_TAG) {
                continue;
            }
            String name = parser.getName();
            if (name.equals("SyntaxColorElementWord")) words.add(readWord(parser));
            else {
                skip(parser);
            }
        }
        String[] wordsResult = new String[words.size()];
        for(int i=0; i<words.size(); i++) wordsResult[i] = words.get(i);
        return new SyntaxHighlightingColorElements(wordsResult, Color.parseColor(color));
    }

    private String readWord(XmlPullParser parser) throws IOException, XmlPullParserException {
        parser.require(XmlPullParser.START_TAG, ns, "SyntaxColorElementWord");
        String resultWord = readText(parser);
        parser.require(XmlPullParser.END_TAG, ns, "SyntaxColorElementWord");
        return resultWord;
    }

    protected String readText(XmlPullParser parser) throws IOException, XmlPullParserException {
        String result = "";
        if (parser.next() == XmlPullParser.TEXT) {
            result = parser.getText();
            parser.nextTag();
        }
        return result;
    }

    protected void skip(XmlPullParser parser) throws XmlPullParserException, IOException {
        if (parser.getEventType() != XmlPullParser.START_TAG) {
            throw new IllegalStateException();
        }
        int depth = 1;
        while (depth != 0) {
            switch (parser.next()) {
                case XmlPullParser.END_TAG:
                    depth--;
                    break;
                case XmlPullParser.START_TAG:
                    depth++;
                    break;
            }
        }
    }
}
