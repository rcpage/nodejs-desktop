<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'wordpress' );

/** MySQL database username */
define( 'DB_USER', 'root' );

/** MySQL database password */
define( 'DB_PASSWORD', 'rpadmin' );

/** MySQL hostname */
define( 'DB_HOST', 'localhost' );

/** Database Charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The Database Collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'Vv{{X@h^sqD=p|eRV!{RGPb7Is.DUne+VC:@ScAq%WJ~1x/mU6H IP=.KR$iV,Ey' );
define( 'SECURE_AUTH_KEY',  'Crt~q(vpV<dUz+rKz$Nf:oLn:QG%=(D}Aa)|)GJ=)#x6Pe4 Xqw-m?tSLmhK{(6 ' );
define( 'LOGGED_IN_KEY',    '*>drSq#1H.5}:%)FxRBd1(1KY.!L%%g<Og)[lKBA&zcA$)FC@x.ef.T;3q[f*c$a' );
define( 'NONCE_KEY',        '.j5z5;$M#9Op5!B{UFiz,1DJ$d>`a5N6b]w}wa$5v_03Ndlf`/k?-CJA4%15+ ei' );
define( 'AUTH_SALT',        'qeQ8c8&M_=_5SK}(#Eg&y7 {[wC!am//B^UHR(Mt&MOk9g&Htt}(n6))uyQ3q@;4' );
define( 'SECURE_AUTH_SALT', 'nM?.P=Rt2YPqwzM|+I1d E ooNo;jw%K5X:8M-po-hlLVr/{^l4(J=_&]tpF9Qnv' );
define( 'LOGGED_IN_SALT',   '$I]UTQIQAT2bvQzNL~5f_U>%l%(YVQ.v||XYkvUbOl.uIXIipp+H{O;egH:kUww?' );
define( 'NONCE_SALT',       'gOv(H%c*ByO]~xB0T=ia*|H?3]^.-nT;*JxO_4Y(HdCfp(u7*K8 6q$CiAVG1jD)' );

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define( 'WP_DEBUG', false );

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', dirname( __FILE__ ) . '/' );
}

/** Sets up WordPress vars and included files. */
require_once( ABSPATH . 'wp-settings.php' );
