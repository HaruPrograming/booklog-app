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
        $request->validate([
            'q'           => 'required|string|min:1|max:200',
            'start_index' => 'integer|min:0',
        ]);

        $books = $this->googleBooksService->search(
            $request->string('q'),
            20,
            (int) $request->input('start_index', 0)
        );

        return response()->json(['books' => $books, 'has_more' => count($books) === 20]);
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
