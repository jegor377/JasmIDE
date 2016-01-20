package JasmIDE.AsmSyntaxHighlighter;

import android.graphics.Color;

import java.util.ArrayList;

import JasmIDE.SyntaxHighlighter.SyntaxHighlighter;
import JasmIDE.SyntaxHighlighter.SyntaxHighlightingColorElements;

public class AsmSyntaxHighlighter extends SyntaxHighlighter {
    public AsmSyntaxHighlighter() {
        elements = new ArrayList<>();
        //normal text color
        normalTextColor = Color.BLACK;
        //commands
        elements.add(new SyntaxHighlightingColorElements(new String[] {
                "aaa",
                "aad",
                "aam"
        }, Color.rgb(50, 80, 200)));
        //operators
        elements.add(new SyntaxHighlightingColorElements(new String[] {
                ",",
                "[",
                "]",
                "+",
                "-",
                "*",
                "/"
        }, Color.rgb(200, 96, 23)));
        //digits
        elements.add(new SyntaxHighlightingColorElements(new String[] {
                "0",
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9"
        }, Color.rgb(65, 200, 90)));
        //labels
        elements.add(new SyntaxHighlightingColorElements(new String[] {
                ":"
        }, Color.rgb(76, 45, 190)));
        //registers
        elements.add(new SyntaxHighlightingColorElements(new String[] {
                "ax",
                "ah",
                "al",
                "dx",
                "dh",
                "dl",
                "bx",
                "bh",
                "bl",
                "sp"
        }, Color.rgb(76, 45, 190)));
        //comments
        elements.add(new SyntaxHighlightingColorElements(new String[] {
                ";"
        }, Color.rgb(48, 48, 48)));
        //sections
        elements.add(new SyntaxHighlightingColorElements(new String[] {
                "section .text",
                "section .data"
        }, Color.rgb(76, 120, 190)));
    }
}
