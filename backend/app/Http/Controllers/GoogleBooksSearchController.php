<?php

namespace App\Http\Controllers;

use App\Services\GoogleBooksService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GoogleBooksSearchController extends Controller
{
    public function __construct(private GoogleBooksService $googleBooksService) {}

    public function search(Request $request): JsonResponse
    {
        $request->validate(['q' => 'required|string|min:1|max:200']);

        $books = $this->googleBooksService->search($request->string('q'));

        return response()->json(['books' => $books]);
    }
}
