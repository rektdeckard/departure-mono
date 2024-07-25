export type FetchWithProgressOptions<D> = {
  method?: string;
  responseType?: XMLHttpRequestResponseType;
  onProgress?: (pct: number) => void;
  onDone?: (res: D) => void;
};

export async function fetchWithProgress<D>(
  url: string,
  opts?: FetchWithProgressOptions<D>,
): Promise<D> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open(opts?.method ?? "GET", url, true);
    xhr.responseType = opts?.responseType ?? "blob";

    xhr.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        opts?.onProgress?.(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response);
        opts?.onDone?.(xhr.response);
      } else {
        reject(new Error(`HTTP error! status: ${xhr.status}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error"));
    };

    xhr.send();
  });
}

export function getCSSVariable(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export const Colors = {
  fg: getCSSVariable("--fg"),
  bg: getCSSVariable("--bg"),
  accent: getCSSVariable("--accent"),
  amber: getCSSVariable("--amber"),
  pumpkin: getCSSVariable("--pumpkin"),
  flux: getCSSVariable("--flux"),
  foam: getCSSVariable("--foam"),
  enamel: getCSSVariable("--enamel"),
  cement: getCSSVariable("--cement"),
  ash: getCSSVariable("--ash"),
  clay: getCSSVariable("--clay"),
  smoke: getCSSVariable("--smoke"),
  carbon: getCSSVariable("--carbon"),
  black: getCSSVariable("--black"),
} as const;
