<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class IsbnSearchService
{
    public function search(string $isbn): ?array
    {
        return $this->searchOpenBd($isbn) ?? $this->searchGoogleBooks($isbn);
    }

    private function searchOpenBd(string $isbn): ?array
    {
        $response = Http::get('https://api.openbd.jp/v1/get', ['isbn' => $isbn]);

        if (!$response->successful()) {
            return null;
        }

        $data = $response->json();

        if (empty($data[0])) {
            return null;
        }

        $summary = $data[0]['summary'] ?? [];

        if (empty($summary['title'])) {
            return null;
        }

        return [
            'title'         => $summary['title'],
            'author'        => $summary['author'] !== '' ? str_replace(',', ' ', $summary['author']) : null,
            'thumbnail_url' => $summary['cover'] !== '' ? ($summary['cover'] ?? null) : null,
            'description'   => null,
        ];
    }

    private function searchGoogleBooks(string $isbn): ?array
    {
        $response = Http::get('https://www.googleapis.com/books/v1/volumes', [
            'q' => "isbn:{$isbn}",
        ]);

        if (!$response->successful()) {
            return null;
        }

        $items = $response->json('items');

        if (empty($items[0]['volumeInfo'])) {
            return null;
        }

        $info = $items[0]['volumeInfo'];

        if (empty($info['title'])) {
            return null;
        }

        $authors = $info['authors'] ?? [];

        return [
            'title'         => $info['title'],
            'author'        => !empty($authors) ? implode(' ', $authors) : null,
            'thumbnail_url' => $info['imageLinks']['thumbnail'] ?? null,
            'description'   => $info['description'] ?? null,
        ];
    }
}
