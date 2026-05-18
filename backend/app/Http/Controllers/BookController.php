<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Services\BookService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookController extends Controller
{
    public function __construct(private BookService $bookService) {}

    public function index(Request $request): JsonResponse
    {
        return response()->json($this->bookService->getAll($request->user()->id));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title'         => 'required|string|max:255',
            'author'        => 'nullable|string|max:255',
            'thumbnail_url' => 'nullable|url',
            'status'        => 'required|in:interested,reading,completed',
            'memo'          => 'nullable|string',
            'series_name'   => 'nullable|string|max:255',
            'volume_number' => 'nullable|integer|min:0',
            'tag_ids'       => 'nullable|array',
            'tag_ids.*'     => 'integer|exists:tags,id',
        ]);

        $book = $this->bookService->create($validated, $request->user()->id);

        return response()->json($book, 201);
    }

    public function update(Request $request, Book $book): JsonResponse
    {
        if ($book->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'title'         => 'sometimes|required|string|max:255',
            'author'        => 'nullable|string|max:255',
            'thumbnail_url' => 'nullable|url',
            'status'        => 'sometimes|required|in:interested,reading,completed',
            'memo'          => 'nullable|string',
            'series_name'   => 'nullable|string|max:255',
            'volume_number' => 'nullable|integer|min:0',
            'tag_ids'       => 'nullable|array',
            'tag_ids.*'     => 'integer|exists:tags,id',
        ]);

        $book = $this->bookService->update($book, $validated);

        return response()->json($book);
    }

    public function destroy(Request $request, Book $book): JsonResponse
    {
        if ($book->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $this->bookService->delete($book);

        return response()->json(null, 204);
    }
}
