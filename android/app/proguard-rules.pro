# Proteksi kelas WebView & Activity
-keep class com.qu.ecosystem.MainActivity { *; }
-keepclassmembers class * extends android.webkit.WebViewClient { *; }
-keepclassmembers class * extends android.webkit.WebChromeClient { *; }

# Pertahankan anotasi JavaScript interface jika ditambahkan di kemudian hari
-keepattributes JavascriptInterface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Hilangkan logging dan pesan debug pada build release
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
}
