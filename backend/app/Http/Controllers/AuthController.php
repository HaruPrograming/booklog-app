<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function handleGoogleCallback(): \Illuminate\Http\RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
        } catch (\Exception $e) {
            \Log::error('handleGoogleCallback: socialite error', ['message' => $e->getMessage()]);
            throw $e;
        }

        $user = User::updateOrCreate(
            ['google_id' => $googleUser->getId()],
            [
                'name'   => $googleUser->getName(),
                'email'  => $googleUser->getEmail(),
                'avatar' => $googleUser->getAvatar(),
            ]
        );

        $token = $user->createToken('auth_token')->plainTextToken;
        $frontendUrl = config('app.frontend_url');

        return redirect($frontendUrl)->withCookie(
            cookie('auth_token', $token, 60 * 24 * 7, '/', null, app()->isProduction(), true, false, 'lax')
        );
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'logged out'])
            ->withCookie(cookie()->forget('auth_token'));
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json($request->user());
    }
}
