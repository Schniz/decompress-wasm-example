use std::io::Read;

use async_compression::tokio::bufread::GzipDecoder;
use flate2::read::GzDecoder;
use futures::{StreamExt, TryStreamExt};
use js_sys::Uint8Array;
use std::collections::VecDeque;
use wasm_bindgen::prelude::*;
use wasm_streams::ReadableStream;

/// This function will decompress a gzip compressed Uint8Array.
#[wasm_bindgen]
pub fn gunzip(bytes: &[u8]) -> Result<JsValue, JsValue> {
    let mut decoder = GzDecoder::new(bytes);
    let mut s = String::new();
    decoder
        .read_to_string(&mut s)
        .map_err(|err| js_sys::Error::new(&err.to_string()))?;
    Ok(JsValue::from_str(&s))
}

/// This function takes a ReadableStream<Uint8Array>
/// and returns a ReadableStream<Uint8Array> that is gunzipped.
#[wasm_bindgen]
pub fn gunzip_stream(stream: JsValue) -> wasm_streams::readable::sys::ReadableStream {
    let stream = ReadableStream::from_raw(stream.dyn_into().unwrap())
        .into_stream()
        .filter_map(|x| async { x.ok() })
        .filter_map(|x| async { x.dyn_into::<Uint8Array>().ok() })
        .map(|x| VecDeque::from(x.to_vec()))
        .map(|x| Ok::<_, std::io::Error>(x));

    let reader = tokio_util::io::StreamReader::new(stream);
    let gzip_reader = GzipDecoder::new(reader);
    let gunzipped_reader = tokio_util::io::ReaderStream::new(gzip_reader)
        .into_stream()
        .filter_map(|x| async { x.ok() })
        .map(|x| Ok(Uint8Array::from(&x[..]).into()));

    ReadableStream::from_stream(gunzipped_reader)
        .into_raw()
        .into()
}
