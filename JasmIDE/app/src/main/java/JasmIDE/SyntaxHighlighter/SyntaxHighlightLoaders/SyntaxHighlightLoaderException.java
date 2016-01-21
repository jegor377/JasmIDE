package JasmIDE.SyntaxHighlighter.SyntaxHighlightLoaders;

public class SyntaxHighlightLoaderException extends Exception {
    public SyntaxHighlightLoaderException(String info) {
        super(info);
    }

    public SyntaxHighlightLoaderException(Exception[] exceptionsToConcatenate) {
        super(concatenateExceptions(exceptionsToConcatenate));
    }

    static String concatenateExceptions(Exception[] exceptionsToConcatenate) {
        String outputResult = "";
        for(Exception e : exceptionsToConcatenate) {
            outputResult+=e.getMessage()+"\n";
        }
        return outputResult;
    }
}
