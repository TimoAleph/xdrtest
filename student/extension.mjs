// 이 파일은 학생이 같은 프로젝트에서 이어서 구현합니다.
// 제공 UI를 받은 것만으로 단계 완료를 인정하지 않습니다.
export function createStudentView() {
  return {
    renderIdentity({ me, devices, sessions } = {}) {
      const element = (tag, text, className) => {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined && text !== null) node.textContent = String(text);
        return node;
      };
      const value = (item) => typeof item === 'string' && item.trim() ? item : null;
      const modeText = (mode) => ({
        demo: '예제 자료(demo) · 실제 연결 아님',
        disconnected: '연결 없음',
        unknown: '연결 상태 확인 불가',
      })[mode] || null;
      const stateText = (kind, status) => {
        const labels = kind === 'device'
          ? { compliant: '보안 기준 충족', noncompliant: '보안 기준 미충족', unknown: '확인 불가' }
          : { active: '활성', expired: '만료', revoked: '철회됨', unknown: '확인 불가' };
        const label = labels[status] || '확인 불가';
        return `${label}${typeof status === 'string' && status ? ` (${status})` : ''}`;
      };
      const section = (title, resource, renderData) => {
        const block = element('section', undefined, 'identity-group');
        block.append(element('h3', title));
        if (!resource || resource.status === 'loading') {
          block.append(element('p', '불러오는 중…', 'state state-loading'));
        } else if (resource.status === 'error') {
          const message = value(resource.error?.message);
          block.append(element('p', `서버에 연결하지 못했습니다${message ? `: ${message}` : ''}`, 'state state-error'));
        } else if (resource.status !== 'ok') {
          block.append(element('p', '상태를 확인할 수 없습니다.', 'state state-error'));
        } else {
          const mode = modeText(resource.mode);
          if (mode) block.append(element('p', mode, resource.mode === 'demo' ? 'tag tag-demo' : 'muted'));
          renderData(block, resource.data);
        }
        return block;
      };
      const detail = (label, text) => {
        const row = element('div', undefined, 'identity-row');
        row.append(element('strong', label), element('span', text));
        return row;
      };
      const namedId = (label, id) => label && id ? `${label} · ID: ${id}` : label || (id ? `ID: ${id}` : '확인 불가');
      const showDevice = (target, device) => {
        target.append(detail('기기', namedId(value(device?.label), value(device?.id))));
        target.append(detail('기기 보안 상태', stateText('device', value(device?.status) || 'unknown')));
      };
      const showSession = (target, session) => {
        target.append(detail('세션 ID', value(session?.id) || '확인 불가'));
        target.append(detail('세션 상태', stateText('session', value(session?.status) || 'unknown')));
      };

      const root = element('div', undefined, 'student-identity');
      root.append(section('내 계정과 현재 연결', me, (target, data) => {
        if (!data || typeof data !== 'object') {
          target.append(element('p', '계정 정보를 확인할 수 없습니다.', 'state state-error'));
          return;
        }
        const userLabel = value(data.user?.label);
        const userId = value(data.user?.id);
        target.append(detail('사용자', namedId(userLabel, userId)));
        showDevice(target, data.device);
        showSession(target, data.session);
      }));
      root.append(section('내 기기', devices, (target, data) => {
        if (!Array.isArray(data)) {
          target.append(element('p', '기기 응답 형식을 확인할 수 없습니다.', 'state state-error'));
        } else if (data.length === 0) {
          target.append(element('p', '등록된 기기가 없습니다.', 'state state-empty'));
        } else {
          const list = element('ul', undefined, 'plain-list');
          for (const device of data) {
            const item = element('li');
            const name = element('span', namedId(value(device?.label), value(device?.id)), 'item-title');
            const status = element('span', stateText('device', value(device?.status) || 'unknown'), 'muted');
            item.append(name, status);
            list.append(item);
          }
          target.append(list);
        }
      }));
      root.append(section('내 로그인 세션', sessions, (target, data) => {
        if (!Array.isArray(data)) {
          target.append(element('p', '세션 응답 형식을 확인할 수 없습니다.', 'state state-error'));
        } else if (data.length === 0) {
          target.append(element('p', '현재 표시할 로그인 세션이 없습니다.', 'state state-empty'));
        } else {
          const list = element('ul', undefined, 'plain-list');
          for (const session of data) {
            const item = element('li');
            item.append(
              element('span', `세션 ID: ${value(session?.id) || '확인 불가'}`, 'item-title'),
              element('span', stateText('session', value(session?.status) || 'unknown'), 'muted'),
            );
            list.append(item);
          }
          target.append(list);
        }
      }));
      return root;
    },
    renderDecision() { return '학생 구현 대기: 서버의 판정과 이유를 연결하세요.'; },
    renderEvents() { return '학생 구현 대기: 본인 접속·XDR 기록을 연결하세요.'; },
    renderStatus() { return '학생 구현 대기: 기기·세션·알림과 연결 점검 상태를 구분하세요.'; },
    renderVulnerabilities() { return '학생 구현 대기: 정확한 설치 버전·OSV 출처·조회 시각·부분 결과·조회 실패를 구분하세요.'; },
    renderAiConnection() { return '학생 구현 대기: 모델 응답 점검과 실제 사건 설명을 구분하고 AI 오류·취소·수동 복구를 안내하세요.'; },
    renderExplanation() { return '학생 구현 대기: 선택한 사건의 근거·규칙·현재 상태와 AI 설명을 연결하세요. 제안은 자동 실행하지 않습니다.'; },
    renderAction() { return '학생 구현 대기: 현재 사건·조치·실제 대상·사람 확인·ACK와 원천 효과·unknown을 구분하세요.'; },
  };
}
