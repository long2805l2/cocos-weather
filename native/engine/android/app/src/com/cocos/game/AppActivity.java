package com.cocos.game;

import android.os.Bundle;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.content.DialogInterface;

import com.cocos.service.SDKWrapper;
import com.cocos.lib.CocosActivity;

import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;

import android.app.AlertDialog;
import android.provider.Settings;
import android.Manifest;
import android.content.pm.PackageManager;
 

public class AppActivity extends CocosActivity 
						 implements GoogleApiClient.ConnectionCallbacks,
						 			GoogleApiClient.OnConnectionFailedListener
{
	// LocationManager locationManager;
	// Context mContext;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		// mContext = this;
		// locationManager = (LocationManager) mContext.getSystemService(Context.LOCATION_SERVICE);
		// isLocationEnabled();

		if (!isTaskRoot()) {
			return;
		}
		
		SDKWrapper.shared().init(this);
	}

	LocationListener locationListenerGPS = new LocationListener()
	{
		@Override
		public void onLocationChanged(android.location.Location location) {
			double latitude = location.getLatitude();
			double longitude = location.getLongitude();
			String msg="com.myweather.AppActivity, New Latitude: " + latitude + "New Longitude: " + longitude;
			System.out.println (msg);
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
	};

	// private void isLocationEnabled()
	// {
	// 	System.out.println ("com.myweather.AppActivity, isLocationEnabled");
	// 	boolean isGPS = checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED;
	// 	boolean isNetwork = checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED;
		
	// 	if (isGPS || isNetwork)
	// 	{
	// 		System.out.println ("com.myweather.AppActivity, isLocationEnabled: requestLocationUpdates");
	// 		locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 2000, 10, locationListenerGPS);
			
	// 		android.location.Location location = locationManager.getLastKnownLocation(isGPS ? LocationManager.GPS_PROVIDER : LocationManager.NETWORK_PROVIDER);
	// 		if (location != null)
	// 		{
	// 			double latitude = location.getLatitude();
	// 			double longitude = location.getLongitude();
	// 			String msg="com.myweather.AppActivity, getLastKnownLocation: " + latitude + ", " + longitude;
	// 			System.out.println (msg);
	// 		}
	// 		else
	// 			System.out.println ("com.myweather.AppActivity, getLastKnownLocation: null, " + isGPS + ", " + isNetwork);

	// 		return;
	// 	}

	// 	AlertDialog.Builder alertDialog = new AlertDialog.Builder(mContext);
	// 	alertDialog.setTitle("Enable Location");
	// 	alertDialog.setMessage("Your locations setting is not enabled. Please enabled it in settings menu.");
	// 	alertDialog.setPositiveButton("Location Settings", new DialogInterface.OnClickListener()
	// 	{
	// 		public void onClick(DialogInterface dialog, int which){
	// 			Intent intent = new Intent(Settings.ACTION_LOCALE_SETTINGS);
	// 			startActivity(intent);
	// 		}
	// 	});
	// 	alertDialog.setNegativeButton("Cancel", new DialogInterface.OnClickListener()
	// 	{
	// 		public void onClick(DialogInterface dialog, int which){
	// 			dialog.cancel();
	// 		}
	// 	});
	// 	AlertDialog alert=alertDialog.create();
	// 	alert.show();
	// }

	@Override
	protected void onResume() {
		super.onResume();
		// isLocationEnabled();

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
		// Workaround in https://stackoverflow.com/questions/16283079/re-launch-of-activity-on-home-button-but-only-the-first-time/16447508
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
		return "My City is Ho Chi Minh";
	}

	@Override
    public void onConnected(@Nullable Bundle bundle)
	{
        // getLocation();
		System.out.println ("com.myweather.AppActivity, onConnected: " );
    }
    
	@Override
    public void onConnectionSuspended(int i)
	{
        // gac.connect();
		
		System.out.println ("com.myweather.AppActivity, onConnectionSuspended: " );
    }

    @Override
    public void onConnectionFailed(@NonNull ConnectionResult connectionResult)
	{
		System.out.println ("com.myweather.AppActivity, onConnectionFailed: " + connectionResult.getErrorMessage());
    }
}
