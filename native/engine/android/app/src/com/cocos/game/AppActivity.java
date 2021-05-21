package com.cocos.game;

import android.os.Bundle;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;

import com.cocos.service.SDKWrapper;
import com.cocos.lib.CocosActivity;
import com.cocos.lib.CocosHelper;
import com.cocos.lib.CocosJavascriptJavaBridge;

import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Build;

import android.annotation.SuppressLint;
import android.annotation.TargetApi;
import android.Manifest;
import android.content.pm.PackageManager;


public class AppActivity extends CocosActivity
						 implements LocationListener
{
	private static AppActivity app = null;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		if (!isTaskRoot()) {
			return;
		}
		SDKWrapper.shared().init(this);
		app = this;
	}

	private static double lastLatitude = 0;
	private static double lastLongitude = 0;
	
	@Override
	public void onLocationChanged(Location location) {
		double newLatitude = location.getLatitude();
		double newLongitude = location.getLongitude();
		System.out.println("com.weather.AppActivity::onLocationChanged, check " + newLatitude + ", " + newLongitude);
		if (lastLatitude == 0 && lastLongitude == 0)
		{
			CocosHelper.runOnGameThread(new Runnable() {
				@Override
				public void run() {
					System.out.println("com.weather.AppActivity::onLocationChanged, runOnGameThread " + newLatitude + ", " + newLongitude);
				}
			});
		}
		lastLatitude = newLatitude;
		lastLongitude = newLongitude;
	}

	@Override
	public void onStatusChanged(String provider, int status, Bundle extras) {
		String msg="com.myweather.AppActivity, onStatusChanged: " + provider + ", " + status;
		System.out.println (msg);
	}

	@Override
	public void onProviderEnabled(String provider) {
		String msg="com.myweather.AppActivity, onProviderEnabled: " + provider;
		System.out.println (msg);
	}

	@Override
	public void onProviderDisabled(String provider) {
		String msg="com.myweather.AppActivity, onProviderDisabled: " + provider;
		System.out.println (msg);
	}

	public static void getLocationCoordinate() {
		System.out.println("com.weather.AppActivity::getLocationCoordinate check " + lastLatitude + "," + lastLongitude);
		if (lastLatitude != 0 && lastLongitude != 0)
			return;
		
		app.runOnUiThread(new Runnable() {
			@TargetApi(Build.VERSION_CODES.M)
			@Override
			public void run() {
				System.out.println("com.weather.AppActivity::getLocationCoordinate, runOnUiThread ");
				app.requestLocationData();
			}
		});
	}

	@TargetApi(Build.VERSION_CODES.M)
	public void requestLocationData()
	{
		LocationManager locationManager = (LocationManager) app.getSystemService(Context.LOCATION_SERVICE);
		if (checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
			System.out.println("com.weather.AppActivity::getLocationCoordinate, requestLocationData ");
			requestPermissions(new String[] { Manifest.permission.ACCESS_FINE_LOCATION}, 1);
			return;
		}
		System.out.println("com.weather.AppActivity::getLocationCoordinate, requestLocationUpdates 2");
		locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 0, 0, (LocationListener) app);
		locationManager.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 0, 0, (LocationListener) app);
	}

	@Override
	protected void onResume() {
		super.onResume();
		SDKWrapper.shared().onResume();
	}

	@Override
	protected void onPause() {
		super.onPause();
		SDKWrapper.shared().onPause();
	}

	@Override
	protected void onDestroy() {
		super.onDestroy();
		if (!isTaskRoot()) {
			return;
		}
		SDKWrapper.shared().onDestroy();
	}

	@Override
	protected void onActivityResult(int requestCode, int resultCode, Intent data) {
		super.onActivityResult(requestCode, resultCode, data);
		SDKWrapper.shared().onActivityResult(requestCode, resultCode, data);
	}

	@Override
	protected void onNewIntent(Intent intent) {
		super.onNewIntent(intent);
		SDKWrapper.shared().onNewIntent(intent);
	}

	@Override
	protected void onRestart() {
		super.onRestart();
		SDKWrapper.shared().onRestart();
	}

	@Override
	protected void onStop() {
		super.onStop();
		SDKWrapper.shared().onStop();
	}

	@Override
	public void onBackPressed() {
		SDKWrapper.shared().onBackPressed();
		super.onBackPressed();
	}

	@Override
	public void onConfigurationChanged(Configuration newConfig) {
		SDKWrapper.shared().onConfigurationChanged(newConfig);
		super.onConfigurationChanged(newConfig);
	}

	@Override
	protected void onRestoreInstanceState(Bundle savedInstanceState) {
		SDKWrapper.shared().onRestoreInstanceState(savedInstanceState);
		super.onRestoreInstanceState(savedInstanceState);
	}

	@Override
	protected void onSaveInstanceState(Bundle outState) {
		SDKWrapper.shared().onSaveInstanceState(outState);
		super.onSaveInstanceState(outState);
	}

	@Override
	protected void onStart() {
		SDKWrapper.shared().onStart();
		super.onStart();
	}

	@Override
	public void onLowMemory() {
		SDKWrapper.shared().onLowMemory();
		super.onLowMemory();
	}
	
	public static String getCurrentLocation ()
	{
		getLocationCoordinate ();
		return "My City is Ho Chi Minh";
	}
}
