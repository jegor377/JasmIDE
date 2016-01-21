package JasmIDE.data;

import android.content.Context;
import android.content.res.Resources;
import android.widget.EditText;

import com.example.mops.jasmide.R;

import JasmIDE.AsmSyntaxHighlighter.AsmSyntaxHighlighter;
import JasmIDE.SyntaxHighlighter.SyntaxHighlighter;

/**
 * Created by mops on 2016-01-18.
 */
public final class DataSingleton {
    private String codeEditData;
    private int codeEditCursorPosition;
    private SyntaxHighlighter highlighter;

    private static DataSingleton instance = null;
    protected DataSingleton() {
        // Exists only to defeat instantiation.
    }
    public static DataSingleton getInstance() {
        if(instance == null) {
            instance = new DataSingleton();
        }
        return instance;
    }

    public void setCodeEdit(String newCodeEditData) {
        if(!newCodeEditData.isEmpty()) {
            codeEditData = newCodeEditData;
        }
    }

    public String getCodeEdit() {
        return codeEditData;
    }

    public void setCodeEditCursorPosition(int newCodeEditCursorPosition)
    {
        if(newCodeEditCursorPosition >= 0)
        {
            codeEditCursorPosition = newCodeEditCursorPosition;
        }
    }

    public int getCodeEditCursorPosition()
    {
        return codeEditCursorPosition;
    }

    public void setEditTextCursorPos(EditText editText, int pos) {
        editText.setSelection(pos, pos);
    }

    public int getEditTextCursorPos(EditText editText) {
        return editText.getSelectionStart();
    }

    public AsmSyntaxHighlighter getHighlighter(Context context) {
        if(highlighter==null) highlighter = new AsmSyntaxHighlighter(context.getResources().openRawResource(R.raw.syntax));
        return (AsmSyntaxHighlighter)highlighter;
    }
}
