# 読書記録アプリ 仕様書

## プロジェクト目的

本を管理・記録する読書記録アプリ。「本屋で気になった本を即記録できる体験」を重視する。

---

## 技術構成

| 項目 | 技術 |
|---|---|
| フロントエンド | React / Vite / TypeScript / TailwindCSS |
| バックエンド | Laravel API |
| DB | MySQL |
| 開発環境 | Docker |
| インフラ | AWS EC2（最終的に） |

---

## 開発ルール

- フェーズ単位で実装する
- 勝手に次フェーズ機能を追加しない
- まず動くMVPを優先する
- UIより先にデータ構造を安定させる
- モバイル利用を前提にする

---

## フェーズ一覧

| フェーズ | 目的 | 状態 |
|---|---|---|
| Phase 1 | 本の登録・一覧表示 | 完了 |
| Phase 2 | タグによる分類管理 | 実装中 |
| Phase 3 | ISBNから本情報を自動取得 | 未着手 |
| Phase 4 | バーコードでISBN入力を自動化 | 未着手 |
| Phase 5 | 読書記録強化（メモ・引用） | 未着手 |

---

## Phase 1: 本の登録・一覧

### 実装内容
- 本登録フォーム（タイトル・ステータス・タグ）
- 本登録API（POST /api/books）
- 本一覧API（GET /api/books）

### booksテーブル

| カラム | 型 |
|---|---|
| id | bigint (PK) |
| title | varchar |
| author | varchar |
| isbn | varchar |
| thumbnail_url | varchar |
| description | text |
| status | enum(interested, reading, completed) |
| created_at | timestamp |

---

## Phase 2: タグ管理

### 実装内容
- タグCRUD API
- 本とタグの多対多関連

### tagsテーブル

| カラム | 型 |
|---|---|
| id | bigint (PK) |
| name | varchar |

### book_tagsテーブル

| カラム | 型 |
|---|---|
| book_id | bigint (FK) |
| tag_id | bigint (FK) |

### status と tags の分離

- **status**: 状態管理（interested / reading / completed）
- **tags**: 分類管理（技術書 / AWS / 小説 など）

---

## Phase 3: ISBN検索

### 実装内容
- ISBN入力 → API検索 → 本情報取得 → 保存

### API優先順位
1. OpenBD
2. Google Books API

---

## Phase 4: バーコード読取

### 実装内容
- スマホカメラ起動
- バーコード読取 → ISBN取得 → Phase 3の処理を再利用

### 使用候補
- zxing
- quaggaJS

---

## Phase 5: 読書記録強化

### book_notesテーブル

| カラム | 型 |
|---|---|
| id | bigint (PK) |
| book_id | bigint (FK) |
| content | text |
| page | int |
| created_at | timestamp |

### 機能
- 感想・引用・学びメモ・ページ番号管理

---

## UI方針

- モバイル優先（片手操作）
- 下固定ボタン
- 大きいタップ領域
- バーコード登録導線を強くする

---

## 最終目標

本を見つける → バーコード読む → 自動登録 → タグ付け → 読書管理 → 感想保存 → あとで検索・見返し
