package JasmIDE.SyntaxHighlighter;

import android.graphics.Color;
import android.text.Editable;
import android.text.Spannable;
import android.text.style.ForegroundColorSpan;

import java.util.ArrayList;
import java.util.List;

public abstract class SyntaxHighlighter {
    protected List<SyntaxHighlightingColorElements> elements;
    protected int normalTextColor;

    public Editable HighligtEditable(Editable editableElement) {
        if(elementsArentEmpty()) {
            String code = editableElement.toString().toLowerCase();

            editableElement = setEditablePartColor(
                    editableElement,
                    normalTextColor,
                    new SyntaxHighlightingElementPosition(0, code.length())
            );

            for(SyntaxHighlightingColorElements element : elements) {
                List<SyntaxHighlightingElementPosition> textPositions;
                for(String part : element.words) {
                    textPositions = getAllTextPositions(part, code);
                    for (SyntaxHighlightingElementPosition textPosition : textPositions) {
                        editableElement = setEditablePartColor(
                                editableElement,
                                element.color,
                                textPosition
                        );
                    }
                }
            }
        }
        return editableElement;
    }

    protected List<SyntaxHighlightingElementPosition> getAllTextPositions(String text, String from) {
        List<SyntaxHighlightingElementPosition> result = new ArrayList<>();
        for(int i = from.indexOf(text); i >= 0; i = from.indexOf(text, i+1)) {
            result.add(new SyntaxHighlightingElementPosition(i, i+text.length()));
        }
        return result;
    }

    protected Editable setEditablePartColor(Editable editableElement, int color, SyntaxHighlightingElementPosition position) {
        editableElement.setSpan(
                new ForegroundColorSpan(color),
                position.getStartPosition(),
                position.getEndPosition(),
                Spannable.SPAN_EXCLUSIVE_EXCLUSIVE
        );
        return editableElement;
    }

    protected boolean elementsArentEmpty()
    {
        return elements!=null && !elements.isEmpty();
    }
}
