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

    public function show(string $id): JsonResponse
    {
        $book = $this->googleBooksService->getDetail($id);

        if (!$book) {
            return response()->json(['message' => 'Not Found'], 404);
        }

        return response()->json(['book' => $book]);
    }
}
