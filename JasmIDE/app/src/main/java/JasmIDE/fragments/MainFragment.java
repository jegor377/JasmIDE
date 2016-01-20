package JasmIDE.fragments;

import android.app.Fragment;
import android.graphics.Color;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.text.Editable;
import android.text.Spannable;
import android.text.TextWatcher;
import android.text.style.ForegroundColorSpan;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;

import com.example.mops.jasmide.R;

import JasmIDE.AsmSyntaxHighlighter.AsmSyntaxHighlighter;
import JasmIDE.data.DataSingleton;

/**
 * Created by mops on 2016-01-18.
 */
public class MainFragment extends Fragment {
    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.main_fragment, container, false);
        EditText codeEdit = (EditText)rootView.findViewById(R.id.editText);
        codeEdit.setText(DataSingleton.getInstance().getCodeEdit());

        int codeEditCursorPos = DataSingleton.getInstance().getCodeEditCursorPosition();
        DataSingleton.getInstance().setEditTextCursorPos(codeEdit, codeEditCursorPos);

        codeEdit.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {

            }

            @Override
            public void afterTextChanged(Editable s) {
                if (!s.toString().isEmpty()) {
                    s = DataSingleton.getInstance().getHighlighter().HighligtEditable(s);
                }
            }
        });

        return rootView;
    }
}
