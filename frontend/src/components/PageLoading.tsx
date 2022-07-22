import HashLoader from "react-spinners/HashLoader";
import { Loading } from "./Loading";

export default function PageLoading(props: { loading?: boolean }) {
  return (
    <>
      {props.loading && (
        <div className="page-loading">
          <div className="loading-box">
            <Loading/>
          </div>
        </div>
      )}
    </>
  );
}
