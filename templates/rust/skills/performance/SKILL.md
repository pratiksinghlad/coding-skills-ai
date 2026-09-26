---
name: performance
description: Use when optimizing Rust runtime or allocations. Covers criterion, zero-copy parsing, and async task efficiency.
---

# Rust Performance

## Measure First
- Profile before optimizing: use `criterion` for micro-benchmarks and `cargo flamegraph` (or `perf`) for real workload profiling.
- Compile with `--release` for all performance measurements; debug builds have no optimizations.

## Allocation & Copy Reduction
- Prefer borrowing (`&str`, `&[T]`) over owned types (`String`, `Vec<T>`) in hot paths; clone only when ownership transfer is necessary.
- Use `Cow<'_, str>` to defer allocation until a mutation is actually needed.
- Use `SmallVec` or fixed-size arrays for collections that are almost always small.
- Avoid boxing (`Box<T>`) in hot paths; prefer stack allocation for small, fixed-size types.

## Zero-Copy Parsing
- Use `bytes::Bytes` and slicing for zero-copy network data parsing.
- Avoid intermediate `String` allocations when parsing structured data; work with `&[u8]` slices directly where possible.

## Async Task Efficiency
- Minimize the number of `tokio::spawn` calls; spawning is cheap but not free — batch work where possible.
- Avoid holding `Mutex` guards across `.await` points; release before yielding.
- Use `tokio::sync::watch` or `tokio::sync::broadcast` for fan-out notifications instead of multiple `Mutex`-protected `Vec` callbacks.

## Iterator Pipelines
- Use lazy iterator adapters (`map`, `filter`, `flat_map`) over imperative loops; the compiler optimizes chains to a single pass.
- Prefer `collect::<Vec<_>>()` once at the end of a pipeline rather than intermediate materialization.
- Use `par_iter()` from `rayon` for CPU-bound parallel data processing — only after profiling confirms a bottleneck.

## Benchmarking
```rust
use criterion::{criterion_group, criterion_main, Criterion};

fn bench_parse(c: &mut Criterion) {
    c.bench_function("parse_record", |b| b.iter(|| parse(INPUT)));
}

criterion_group!(benches, bench_parse);
criterion_main!(benches);
```
Run with `cargo bench`.
