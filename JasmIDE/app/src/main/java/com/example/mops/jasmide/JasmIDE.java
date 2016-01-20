package com.example.mops.jasmide;

import android.app.Fragment;
import android.app.FragmentManager;
import android.content.Context;
import android.os.Bundle;
import android.provider.ContactsContract;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.View;
import android.support.design.widget.NavigationView;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBarDrawerToggle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.EditText;
import android.widget.Toast;

import JasmIDE.data.DataSingleton;
import JasmIDE.fragments.MainFragment;

public class JasmIDE extends AppCompatActivity
        implements NavigationView.OnNavigationItemSelectedListener {

    private Toast toast;
    private Context context;
    private int toastShowDuration;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_jasm_ide);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(
                this, drawer, toolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        drawer.setDrawerListener(toggle);
        toggle.syncState();

        NavigationView navigationView = (NavigationView) findViewById(R.id.nav_view);
        navigationView.setNavigationItemSelectedListener(this);

        context = getApplicationContext();
        toastShowDuration = Toast.LENGTH_SHORT;

        showMainFragment();
    }

    @Override
    public void onBackPressed() {
        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        if (drawer.isDrawerOpen(GravityCompat.START)) {
            drawer.closeDrawer(GravityCompat.START);
        } else {
            super.onBackPressed();
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.jasm_ide, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        switch (id)
        {
            case R.id.action_open:
                toast = Toast.makeText(context, "Open", toastShowDuration);
                toast.show();
                break;
            case R.id.action_save:
                toast = Toast.makeText(context, "Save", toastShowDuration);
                toast.show();
                break;
        }

        return super.onOptionsItemSelected(item);
    }

    @SuppressWarnings("StatementWithEmptyBody")
    @Override
    public boolean onNavigationItemSelected(MenuItem item) {
        // Handle navigation view item clicks here.
        int id = item.getItemId();

        EditText codeEdit = (EditText)findViewById(R.id.editText);
        String code = codeEdit.getText().toString();
        DataSingleton.getInstance().setCodeEdit(code);
        int codeEditCursorPosition = DataSingleton.getInstance().getEditTextCursorPos(codeEdit);
        DataSingleton.getInstance().setCodeEditCursorPosition(codeEditCursorPosition);

        switch(id) {
            case R.id.nav_code:
                showMainFragment();
                break;
            case R.id.nav_compile:
                toast = Toast.makeText(context, "Compile", toastShowDuration);
                toast.show();
                break;
            case R.id.nav_run:
                toast = Toast.makeText(context, "Run", toastShowDuration);
                toast.show();
                break;
            case R.id.nav_debug:
                toast = Toast.makeText(context, "Debug", toastShowDuration);
                toast.show();
                break;
            case R.id.nav_registers:
                toast = Toast.makeText(context, "Registers", toastShowDuration);
                toast.show();
                break;
            case R.id.nav_manual:
                toast = Toast.makeText(context, "Manual", toastShowDuration);
                toast.show();
                break;
        }

        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        drawer.closeDrawer(GravityCompat.START);
        return true;
    }

    private void showMainFragment()
    {
        FragmentManager fragmentManager = getFragmentManager();
        fragmentManager.beginTransaction().replace(R.id.app_content, new MainFragment()).commit();
    }
}
